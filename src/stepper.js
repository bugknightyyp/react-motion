/* @flow */

// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
// array reference around.
let reusedTuple: [number, number] = [0, 0];
export default function stepper(
  secondPerFrame: number,//每帧多少秒
  x: number,//StyleValue
  v: number,//VelocityValue
  destX: number, //styleValue.val
  k: number,//劲度系数
  b: number,// 阻尼系统
  precision: number): [number, number] {//precision： 决定插值及速度的四舍五入
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  /*
    对于动画来说，destX是弹簧静止时的真实长度，初始长度被认为是弹簧被拉伸或压缩的位置
  */
  const Fspring = -k * (x - destX);//弹簧拉力 劲度系数单位牛/米（N/m）

  // Damping, in kg / s
  const Fdamper = -b * v;// 阻力 简化了的阻力计算方式  详看维基百科-阻力方程-https://zh.wikipedia.org/wiki/%E9%98%BB%E5%8A%9B%E6%96%B9%E7%A8%8B

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  /*
    通常我们会使用质量，但是对于动画来说，指定质量有点多余。你可以简化调整根据：a = (Fspring + Fdamper) / mass;
    加速度和质量的关系：a = force / acceleration
  */
  const a = Fspring + Fdamper;

  const newV = v + a * secondPerFrame;// 加速度时间计算速度
  const newX = x + newV * secondPerFrame; // 速度时间计算位移

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {// 如果接近误差范围，那么就算到达到目的
    reusedTuple[0] = destX;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newX;//newLastIdealStyleValue
  reusedTuple[1] = newV;//newLastIdealVelocityValue
  return reusedTuple;
}
