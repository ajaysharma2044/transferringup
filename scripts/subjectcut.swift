// Lifts the foreground subject(s) onto a TRANSPARENT background (PNG) using
// Vision's foreground-instance mask (works on any subject, not just people).
//   xcrun swift scripts/subjectcut.swift <input> <output.png>
import Foundation
import CoreImage
import Vision
import AppKit
import ImageIO

let args = CommandLine.arguments
guard args.count >= 3 else { fatalError("usage: subjectcut.swift <in> <out.png>") }
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])

func loadOriented(_ url: URL) -> CIImage? {
    guard let img = CIImage(contentsOf: url) else { return nil }
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil),
          let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any],
          let o = props[kCGImagePropertyOrientation] as? UInt32 else { return img }
    return img.oriented(forExifOrientation: Int32(o))
}

guard let raw = loadOriented(inURL) else { fatalError("could not load \(args[1])") }
let handler = VNImageRequestHandler(ciImage: raw, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let result = req.results?.first else { fatalError("no subject found") }

let buffer = try result.generateMaskedImage(
    ofInstances: result.allInstances,
    from: handler,
    croppedToInstancesExtent: true
)
let ci = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext(options: [.workingColorSpace: CGColorSpaceCreateDeviceRGB()])
guard let cg = ctx.createCGImage(ci, from: ci.extent) else { fatalError("render failed") }
let rep = NSBitmapImageRep(cgImage: cg)
guard let data = rep.representation(using: .png, properties: [:]) else { fatalError("encode failed") }
try data.write(to: outURL)
print("ok \(outURL.lastPathComponent) \(Int(ci.extent.width))x\(Int(ci.extent.height))")
