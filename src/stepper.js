/* @flow */

// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
// array reference around.
let reusedTuple: [number, number] = [0, 0];
export default function stepper(
  secondPerFrame: number,//每帧多少秒
  x: number,
  v: number,
  destX: number,
  k: number,//劲度系数
  b: number,// 阻尼系统
  precision: number): [number, number] {//precision： 决定插值及速度的四舍五入
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  /*
    对于动画来说，destX是弹簧静止时的真实长度，初始长度被认为是弹簧被拉伸或压缩的位置
  */
  const Fspring = -k * (x - destX);//弹簧拉力

  // Damping, in kg / s
  const Fdamper = -b * v;// 阻力

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  const a = Fspring + Fdamper;

  const newV = v + a * secondPerFrame;
  const newX = x + newV * secondPerFrame;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newX;
  reusedTuple[1] = newV;
  return reusedTuple;
}
