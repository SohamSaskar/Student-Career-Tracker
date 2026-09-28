"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;
void main() {
 vUv = position * 0.5 + 0.5;
 gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderGLSL = `
precision highp float;
varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3 u_colors[4];
uniform vec3 u_bg;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
 const vec4 C = vec4(0.211324865405187, 0.366025403784439,
 -0.577350269189626, 0.024390243902439);
 vec2 i = floor(v + dot(v, C.yy) );
 vec2 x0 = v - i + dot(i, C.xx);
 vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
 vec4 x12 = x0.xyxy + C.xxzz;
 x12.xy -= i1;
 i = mod(i, 289.0);
 vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
 + i.x + vec3(0.0, i1.x, 1.0 ));
 vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
 dot(x12.zw,x12.zw)), 0.0);
 m = m*m ;
 m = m*m ;
 vec3 x = 2.0 * fract(p * C.www) - 1.0;
 vec3 h = abs(x) - 0.5;
 vec3 ox = floor(x + 0.5);
 vec3 a0 = x - ox;
 m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
 vec3 g;
 g.x = a0.x * x0.x + h.x * x0.y;
 g.yz = a0.yz * x12.xz + h.yz * x12.yw;
 return 130.0 * dot(m, g);
}

void main() {
 vec2 uv = vUv;
 float ratio = u_resolution.x / u_resolution.y;
 vec2 p = uv - 0.5;
 p.x *= ratio;

 float t = u_time * 0.1;

 float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
 float n2 = snoise(p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25);
 float n3 = snoise(p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2);

 vec3 col = u_bg;
 
 float dist = length(p) * 1.5;
 float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
 
 col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
 col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.7);
 col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.6);
 col = mix(col, u_colors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.5);

 float glow = smoothstep(0.8, 0.0, dist) * 0.3;
 col += u_colors[1] * glow;

 col = mix(col * 0.85, col, vignette);

 float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
 col += (grain - 0.5) * u_grain * 0.1;

 gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  bg?: string;
  colors?: string[];
  speed?: number;
  grain?: number;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

// DevTrack approved light palette defaults
const DEFAULT_LIGHT_COLORS = ["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"];

export const Velaris: React.FC<VelarisProps> = ({
  bg = "#F5F6F7",
  colors = DEFAULT_LIGHT_COLORS,
  speed = 1.2,
  grain = 0.15,
  height = "auto",
  className,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hexToRgb = (hex: string): [number, number, number] => {
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      return [
        parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
        parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
        parseInt(cleanHex[2] + cleanHex[2], 16) / 255,
      ];
    }
    return [
      parseInt(cleanHex.slice(0, 2), 16) / 255,
      parseInt(cleanHex.slice(2, 4), 16) / 255,
      parseInt(cleanHex.slice(4, 6), 16) / 255,
    ];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveSpeed = prefersReducedMotion ? 0 : speed;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vert = createShader(gl.VERTEX_SHADER, vertexShaderGLSL);
    const frag = createShader(gl.FRAGMENT_SHADER, fragmentShaderGLSL);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      res: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      grain: gl.getUniformLocation(program, "u_grain"),
      colors: gl.getUniformLocation(program, "u_colors"),
      bg: gl.getUniformLocation(program, "u_bg"),
    };

    // Pre-allocate arrays and color calculations outside the render loop
    const bgRgb = hexToRgb(bg);
    const flatColors = new Float32Array(colors.slice(0, 4).flatMap(hexToRgb));

    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (container.clientWidth || 800) * dpr;
      canvas.height = (container.clientHeight || 600) * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf: number | null = null;

    const render = (t: number) => {
      if (!isIntersecting || !isTabVisible) {
        raf = null;
        return;
      }

      gl.uniform2f(locs.res, canvas.width, canvas.height);
      gl.uniform1f(locs.time, t * 0.001 * effectiveSpeed);
      gl.uniform1f(locs.grain, grain);
      gl.uniform3f(locs.bg, bgRgb[0], bgRgb[1], bgRgb[2]);
      gl.uniform3fv(locs.colors, flatColors);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(render);
      }
    };

    const startAnimation = () => {
      if (raf === null && isIntersecting && isTabVisible) {
        raf = requestAnimationFrame(render);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        startAnimation();
      } else if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, { threshold: 0.05 });
    io.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startAnimation();
      } else if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    startAnimation();

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [bg, colors, speed, grain]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: height !== "auto" ? height : undefined }}
      className={cn("relative w-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default Velaris;
