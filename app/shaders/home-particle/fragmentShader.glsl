uniform sampler2D uTexture;
uniform float uLerp;
varying vec2 vUv;
varying vec3 vColor;

void main()
{
    vec4 ttt=texture2D(uTexture,vUv);
    vec3 color=mix(vec3(1.,0.,0.),vColor,uLerp);
    gl_FragColor=vec4(vec3(color*2.),ttt.r*4.);
}