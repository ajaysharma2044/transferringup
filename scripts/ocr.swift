import Foundation
import Vision
import AppKit

let args = CommandLine.arguments
guard args.count > 1 else { FileHandle.standardError.write("usage: ocr.swift <image>\n".data(using:.utf8)!); exit(1) }
let path = args[1]
guard let img = NSImage(contentsOfFile: path),
      let tiff = img.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let cg = bitmap.cgImage else { FileHandle.standardError.write("load fail\n".data(using:.utf8)!); exit(1) }
let W = Double(cg.width), H = Double(cg.height)
let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = false
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try? handler.perform([req])
var out: [[String:Any]] = []
for obs in (req.results ?? []) {
  guard let cand = obs.topCandidates(1).first else { continue }
  let bb = obs.boundingBox // normalized, origin bottom-left
  let x = Int(bb.minX * W)
  let w = Int(bb.width * W)
  let h = Int(bb.height * H)
  let y = Int((1 - bb.maxY) * H) // top-left origin
  out.append(["text": cand.string, "x": x, "y": y, "w": w, "h": h])
}
let data = try! JSONSerialization.data(withJSONObject: ["W": Int(W), "H": Int(H), "lines": out])
print(String(data: data, encoding: .utf8)!)
