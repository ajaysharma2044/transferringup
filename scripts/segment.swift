// Person-segments a photo (Apple Vision) and composites the person onto a
// uniform studio-gray backdrop, so every reviewer headshot shares one
// consistent background. Usage:
//   xcrun swift scripts/segment.swift <input> <output.png>
import Foundation
import CoreImage
import Vision
import AppKit
import ImageIO

let args = CommandLine.arguments
guard args.count >= 3 else { fatalError("usage: segment.swift <input> <output.png>") }
let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

// Load the image applying its EXIF orientation so the result is upright.
func loadOriented(_ url: URL) -> CIImage? {
    guard let img = CIImage(contentsOf: url) else { return nil }
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil),
          let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any],
          let o = props[kCGImagePropertyOrientation] as? UInt32 else { return img }
    return img.oriented(forExifOrientation: Int32(o))
}

// Highlight-based white balance, sampled from the PERSON ONLY (a bright/busy
// background must not bias the correction). Returns gentle per-channel gains.
func wbCoeffs(_ image: CIImage, _ ctx: CIContext) -> (CGFloat, CGFloat) {
    let s = 120.0 / image.extent.width
    let small = image.transformed(by: CGAffineTransform(scaleX: s, y: s))
    guard let cg = ctx.createCGImage(small, from: small.extent),
          let rep = NSBitmapImageRep(cgImage: cg) as NSBitmapImageRep? else { return (1, 1) }
    var sr = 0.0, sg = 0.0, sb = 0.0, n = 0.0
    for y in 0..<rep.pixelsHigh {
        for x in 0..<rep.pixelsWide {
            guard let c = rep.colorAt(x: x, y: y) else { continue }
            let r = Double(c.redComponent), g = Double(c.greenComponent), b = Double(c.blueComponent)
            let mx = max(r, max(g, b)), mn = min(r, min(g, b))
            let lum = 0.299 * r + 0.587 * g + 0.114 * b
            let sat = mx <= 0 ? 0 : (mx - mn) / mx
            if lum > 0.70 && lum < 0.99 && sat < 0.16 { sr += r; sg += g; sb += b; n += 1 }
        }
    }
    guard n >= 10 else { return (1, 1) } // no reliable white reference on the person
    let wr = sr / n, wg = sg / n, wb = sb / n
    func cl(_ v: Double) -> CGFloat { CGFloat(min(1.18, max(0.85, v))) }
    return (cl(wg / max(wr, 0.001)), cl(wg / max(wb, 0.001)))
}
func applyWB(_ image: CIImage, _ kr: CGFloat, _ kb: CGFloat) -> CIImage {
    guard let m = CIFilter(name: "CIColorMatrix") else { return image }
    m.setValue(image, forKey: kCIInputImageKey)
    m.setValue(CIVector(x: kr, y: 0, z: 0, w: 0), forKey: "inputRVector")
    m.setValue(CIVector(x: 0, y: 1, z: 0, w: 0), forKey: "inputGVector")
    m.setValue(CIVector(x: 0, y: 0, z: kb, w: 0), forKey: "inputBVector")
    return m.outputImage ?? image
}

let ctx = CIContext(options: [.workingColorSpace: CGColorSpaceCreateDeviceRGB()])
guard let raw = loadOriented(inputURL) else { fatalError("could not load \(args[1])") }
let extent = raw.extent

// --- person mask (from the raw image) ---
let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(ciImage: raw, options: [:]).perform([req])
guard let obs = req.results?.first else { fatalError("no person mask for \(args[1])") }

var mask = CIImage(cvPixelBuffer: obs.pixelBuffer)
// scale mask up to the photo's resolution
mask = mask.transformed(by: CGAffineTransform(scaleX: extent.width / mask.extent.width,
                                              y: extent.height / mask.extent.height))
// erode the matte inward to cut the residual original-background halo / fringe.
// `tight` mode pulls harder into dark hair to kill flyaway haze (use for
// voluminous/wispy DARK hair; do not use on light/blond hair).
let tightHair = args.contains("tight")
if let mn = CIFilter(name: "CIMorphologyMinimum") {
    mn.setValue(mask, forKey: kCIInputImageKey)
    mn.setValue(max(1.5, extent.width * (tightHair ? 0.0066 : 0.0016)), forKey: kCIInputRadiusKey)
    if let m = mn.outputImage { mask = m.cropped(to: extent) }
}
// feather for a soft, natural edge
if let blur = CIFilter(name: "CIGaussianBlur") {
    blur.setValue(mask, forKey: kCIInputImageKey)
    blur.setValue(tightHair ? 1.0 : 1.4, forKey: kCIInputRadiusKey)
    if let b = blur.outputImage { mask = b.cropped(to: extent) }
}

// --- white balance, sampled from the person only (mask out the background) ---
let blackBG = CIImage(color: .black).cropped(to: extent)
let personOnly = CIFilter(name: "CIBlendWithMask", parameters: [
    kCIInputImageKey: raw, kCIInputBackgroundImageKey: blackBG, kCIInputMaskImageKey: mask
])?.outputImage ?? raw
let (kr, kb) = wbCoeffs(personOnly, ctx)
let person = applyWB(raw, kr, kb)

// --- flat, seamless warm-neutral greige backdrop (#E7E2D8) ---
let bg = CIImage(color: CIColor(red: 231 / 255.0, green: 226 / 255.0, blue: 216 / 255.0)).cropped(to: extent)

// --- composite person over backdrop using the mask ---
let blend = CIFilter(name: "CIBlendWithMask")!
blend.setValue(person, forKey: kCIInputImageKey)
blend.setValue(bg, forKey: kCIInputBackgroundImageKey)
blend.setValue(mask, forKey: kCIInputMaskImageKey)
guard let out = blend.outputImage else { fatalError("blend failed") }

// --- crop to a consistent head-and-shoulders frame (face-centred) ---
// optional args: [3]=aspect "W:H" (default 1:1), [4]=output height px (default 512)
var arW = 1.0, arH = 1.0
if args.count >= 4 {
    let p = args[3].split(separator: ":")
    if p.count == 2, let a = Double(p[0]), let b = Double(p[1]) { arW = a; arH = b }
}
let AR = CGFloat(arW / arH)
let sizePx: CGFloat = args.count >= 5 ? CGFloat(Double(args[4]) ?? 512) : 512 // target crop height

let W = extent.width, H = extent.height
// Pad the composite onto an INFINITE greige canvas so the crop is never clamped by
// the photo edges — this keeps the eye line + face size identical across the set
// even when the framing extends past the original photo.
let greige = CIColor(red: 231 / 255.0, green: 226 / 255.0, blue: 216 / 255.0)
let canvas = out.composited(over: CIImage(color: greige))

let EYE_W_FRAC: CGFloat = 0.205  // eye-to-eye distance as a fraction of the crop width
let EYE_TOP_FRAC: CGFloat = 0.44 // eye line measured from the TOP of the crop

func eyeCenter(_ r: VNFaceLandmarkRegion2D?) -> CGPoint? {
    guard let pts = r?.pointsInImage(imageSize: CGSize(width: W, height: H)), !pts.isEmpty else { return nil }
    let sx = pts.reduce(0) { $0 + $1.x }, sy = pts.reduce(0) { $0 + $1.y }
    return CGPoint(x: sx / CGFloat(pts.count), y: sy / CGFloat(pts.count))
}

let lmReq = VNDetectFaceLandmarksRequest()
try? VNImageRequestHandler(ciImage: person, options: [:]).perform([lmReq])
let face = lmReq.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width })

var cropRect: CGRect
if let f = face, let le = eyeCenter(f.landmarks?.leftEye), let re = eyeCenter(f.landmarks?.rightEye) {
    // CONSISTENT face size (same eye distance) for everyone, eyes ~40% from top.
    // Any slack from a tight source goes to TOP headroom (looks natural) — never a
    // bottom gap (which reads as a cut-off / floating subject).
    let mx = (le.x + re.x) / 2, my = (le.y + re.y) / 2
    let eyeDist = hypot(re.x - le.x, re.y - le.y)
    let cw = eyeDist / EYE_W_FRAC
    let ch = cw / AR
    var yb = my - (1 - EYE_TOP_FRAC) * ch   // ideal: eyes at EYE_TOP_FRAC from the top
    yb = max(0, yb)                         // clamp so the crop never pads below the photo
    var x = mx - cw / 2
    if cw <= W { x = max(0, min(x, W - cw)) } // (a very wide crop just gets symmetric side headroom)
    cropRect = CGRect(x: x, y: yb, width: cw, height: ch)
} else if let f = face {
    // fallback: face bounding box
    let bb = f.boundingBox
    let fw = bb.width * W, fh = bb.height * H
    let ch = max(fw, fh) * 3.7, cw = max(fw, fh) * 3.7 * AR
    cropRect = CGRect(x: bb.minX * W + fw / 2 - cw / 2, y: bb.minY * H + fh / 2 - ch * 0.55, width: cw, height: ch)
} else {
    var cw = W, ch = W / AR
    if ch > H { ch = H; cw = H * AR }
    cropRect = CGRect(x: (W - cw) / 2, y: H - ch, width: cw, height: ch)
}

let cropped = canvas.cropped(to: cropRect)
let scale = sizePx / cropRect.height
let scaled = cropped.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
guard let cg = ctx.createCGImage(scaled, from: scaled.extent) else { fatalError("render failed") }
let rep = NSBitmapImageRep(cgImage: cg)
guard let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.86]) else { fatalError("encode failed") }
try data.write(to: outputURL)
print("ok \(outputURL.lastPathComponent) -> \(Int(scaled.extent.width))x\(Int(scaled.extent.height))")
