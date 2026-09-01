// Cuts a person out onto a TRANSPARENT background (PNG) for compositing in front
// of a campus image. Crops to head + torso, anchored to the bottom of the photo.
//   xcrun swift scripts/cutout.swift <input> <output.png>
import Foundation
import CoreImage
import Vision
import AppKit
import ImageIO

let args = CommandLine.arguments
guard args.count >= 3 else { fatalError("usage: cutout.swift <in> <out.png>") }
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])

func loadOriented(_ url: URL) -> CIImage? {
    guard let img = CIImage(contentsOf: url) else { return nil }
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil),
          let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any],
          let o = props[kCGImagePropertyOrientation] as? UInt32 else { return img }
    return img.oriented(forExifOrientation: Int32(o))
}

let ctx = CIContext(options: [.workingColorSpace: CGColorSpaceCreateDeviceRGB()])
guard let raw = loadOriented(inURL) else { fatalError("could not load \(args[1])") }
let extent = raw.extent
let W = extent.width, H = extent.height

// person mask
let seg = VNGeneratePersonSegmentationRequest()
seg.qualityLevel = .accurate
seg.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(ciImage: raw, options: [:]).perform([seg])
guard let obs = seg.results?.first else { fatalError("no person mask") }
let rawMask = CIImage(cvPixelBuffer: obs.pixelBuffer)
var mask = rawMask.transformed(by: CGAffineTransform(scaleX: W / rawMask.extent.width, y: H / rawMask.extent.height))
if let mn = CIFilter(name: "CIMorphologyMinimum") {
    mn.setValue(mask, forKey: kCIInputImageKey); mn.setValue(max(1.5, W * 0.0022), forKey: kCIInputRadiusKey)
    if let m = mn.outputImage { mask = m.cropped(to: extent) }
}
if let bl = CIFilter(name: "CIGaussianBlur") {
    bl.setValue(mask, forKey: kCIInputImageKey); bl.setValue(1.3, forKey: kCIInputRadiusKey)
    if let b = bl.outputImage { mask = b.cropped(to: extent) }
}

// person over transparent
let clear = CIImage(color: CIColor(red: 0, green: 0, blue: 0, alpha: 0)).cropped(to: extent)
let cut = CIFilter(name: "CIBlendWithMask", parameters: [
    kCIInputImageKey: raw, kCIInputBackgroundImageKey: clear, kCIInputMaskImageKey: mask
])!.outputImage!

// crop to head + torso (anchored to the bottom of the photo), centred on the face
var crop = extent
let fr = VNDetectFaceRectanglesRequest()
try? VNImageRequestHandler(ciImage: raw, options: [:]).perform([fr])
if let f = fr.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width }) {
    let bb = f.boundingBox
    let fw = bb.width * W, fh = bb.height * H
    let cx = bb.minX * W + fw / 2
    let topY = min(H, bb.maxY * H + fh * 0.55) // headroom above the hair (y-up)
    let cw = min(W, topY * 0.74)               // fixed portrait aspect → consistent figure across people
    let x = max(0, min(cx - cw / 2, W - cw))
    crop = CGRect(x: x, y: 0, width: cw, height: topY) // from bottom up to just above the head
}

let target: CGFloat = 1100
let scale = target / crop.height
let scaled = cut.cropped(to: crop).transformed(by: CGAffineTransform(scaleX: scale, y: scale))
guard let cg = ctx.createCGImage(scaled, from: scaled.extent) else { fatalError("render failed") }
let rep = NSBitmapImageRep(cgImage: cg)
guard let data = rep.representation(using: .png, properties: [:]) else { fatalError("encode failed") }
try data.write(to: outURL)
print("ok \(outURL.lastPathComponent) \(Int(scaled.extent.width))x\(Int(scaled.extent.height))")
