import Foundation
import CoreImage
import Vision
import ImageIO
let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let img = CIImage(contentsOf: url) else { fatalError("load") }
let W = img.extent.width, H = img.extent.height
let req = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(ciImage: img, options: [:]).perform([req])
guard let f = req.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width }) else { print("\(url.lastPathComponent): NO FACE"); exit(0) }
func ec(_ r: VNFaceLandmarkRegion2D?) -> CGPoint? {
  guard let p = r?.pointsInImage(imageSize: CGSize(width: W, height: H)), !p.isEmpty else { return nil }
  return CGPoint(x: p.reduce(0){$0+$1.x}/CGFloat(p.count), y: p.reduce(0){$0+$1.y}/CGFloat(p.count))
}
if let le = ec(f.landmarks?.leftEye), let re = ec(f.landmarks?.rightEye) {
  let d = hypot(re.x-le.x, re.y-le.y), my = (le.y+re.y)/2
  print(String(format: "%@  eyeDist=%.1f%%W  eyeLine=%.1f%%fromTop", url.lastPathComponent, d/W*100, (H-my)/H*100))
} else { print("\(url.lastPathComponent): no eye landmarks") }
