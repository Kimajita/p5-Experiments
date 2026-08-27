precision highp float;

varying vec3 vPosition;
varying vec2 vUV;

uniform float u_time;
uniform float u_resolution;

uniform float u_spectrum[32];
uniform float u_wave[1024];
uniform float u_vol;

const float pi = 3.1415926535;

vec3 rgb(int r, int g, int b) { vec3 rgb = vec3(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0); return rgb; }

vec3 hsb(in vec3 col) {
  vec3 rgb = clamp(abs(mod(col.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return col.z * mix(vec3(1.0), rgb, col.y);
}

float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

vec2 skew(vec2 st) { //basically tilting, if unsure just test: vec2 col = fract(skew(st));
    vec2 r = vec2(0.0); r.x = 1.1547 * st.x; r.y = st.y + 0.5 * r.x;
    return r;
}

vec2 rotate2D(vec2 st, float rot) {
    st -= 0.5;
    st = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * st;
    st += 0.5;
    return st;
}

vec2 rotateTiles(vec2 st) {
    st *= 2.0;
    float index = 0.0;

    index += step(1.0, mod(st.x, 2.0));
    index += step(1.0, mod(st.y, 2.0)) * 2.0;

    st = fract(st);
    if (index == 1.0) { st = rotate2D(st, pi * 0.5); }
        else if (index == 2.0) { st = rotate2D(st, pi * -0.5); }
            else if (index == 3.0) { st = rotate2D(st, pi); }

    return st;
}

vec2 truchet(vec2 st, float index) {
    index = fract(((index - 0.5) * 2.0));
    if (index > 0.75) { st = vec2(1.0) - st; }
        else if (index > 0.5) { st = vec2(1.0 - st.x, st.y); }
            else if (index > 0.25) { st = 1.0 - vec2(1.0 - st.x, st.y); }
    return st;
}

const float lineThickness = 0.005;
float line(vec2 pos1, vec2 pos2, vec2 st) {
    float a = abs(distance(pos1, st));
    float b = abs(distance(pos2, st));
    float c = abs(distance(pos1, pos2));

    if (a >= c || b >= c) { return 0.0; }

    float p = (a + b + c) * 0.5;
    float h = 2.0 / c * sqrt(p * (p - a) * (p - b) * (p - c));

    float line = mix(1.0, 0.0, smoothstep(0.5 * lineThickness, 1.5 * lineThickness, h));

    return line;
}

void main() {
    vec2 uv0 = vUV;
    vec2 uv = vUV * 2.0 - 1.0;

    float time = u_time * 0.5;
    float volume = 0.0;
    for (int i = 0; i < 32; i++) {
        volume += u_spectrum[i];
    }

    vec2 st = uv; //input copy

    float angle = atan(st.y, st.x) - time;
    float radius = length(st * 2.0);
    vec3 rainbow = hsb(vec3(angle / (pi * 2.0) + 0.5 , radius, 1.0));

    vec4 line = vec4(max(
            line(vec2(0.0, 1.0), vec2(1.0, 0.5), st),
            line(vec2(0.0, 0.0), vec2(0.5, 0.6), st)));

    gl_FragColor = vec4(line);
}
