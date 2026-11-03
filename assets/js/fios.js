/* Fios com brilho espelhado: cabelo liso gerado em shader, com a faixa de luz da progressiva.
   Tudo depende de seno de T, então o loop fecha sem emenda (16 s). */
(function(){
var FRAG=`precision highp float;
uniform vec2 R;uniform float T;uniform float F;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 uv=gl_FragCoord.xy/R;uv.y=1.-uv.y;
 vec2 p=vec2(uv.x*R.x/R.y,uv.y);
 float caim=smoothstep(.05,1.,p.y);
 float w=sin(p.y*3.1+p.x*1.15+.55*sin(T))*.034
        +sin(p.y*6.7+p.x*2.2-.8*sin(T+1.))*.012*caim
        +sin(p.x*1.4+T)*.014*caim;
 float x=p.x+w;
 float a=n(vec2(x*52.,p.y*.8)),b=n(vec2(x*170.,p.y*1.5+3.)),c=n(vec2(x*520.,p.y*2.8+7.)),d=n(vec2(x*1500.,p.y*5.+1.));
 float fio=a*.36+b*.3+c*.22+d*.12;
 float mecha=n(vec2(x*5.5,p.y*.45+2.));
 vec3 raiz=vec3(.052,.016,.026),meio=vec3(.205,.038,.078),ponta=vec3(.42,.17,.09);
 vec3 col=mix(raiz,meio,smoothstep(.0,.6,p.y));
 col=mix(col,ponta,smoothstep(.5,1.15,p.y)*(.25+.75*mecha)*.8);
 col*=.38+1.05*fio;
 float curva=.07*sin(x*2.3+.8)+.022*sin(x*8.+1.3);
 float b1=.40+.045*sin(T)+curva+(a-.5)*.075+(b-.5)*.05+w*1.6;
 float e1=(p.y-b1)/.075;float e2=(p.y-(b1+.29+.035*cos(T)))/.05;
 float luz=exp(-e1*e1)+exp(-e2*e2)*.36;
 float cinti=.5+1.25*c*(.4+d);
 col+=vec3(1.,.8,.64)*luz*luz*cinti*.42*(.75+.5*mecha);
 col+=vec3(.55,.12,.2)*exp(-e1*e1*.14)*.1;
 col*=F;
 gl_FragColor=vec4(pow(col,vec3(.92)),1.);
}`;
var VERT='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
function inicia(cv,o){
 o=o||{};
 var gl=cv.getContext('webgl',{antialias:false,alpha:false,preserveDrawingBuffer:!!o.captura,powerPreference:'low-power'});
 if(!gl)return null;
 function sh(t,s){var x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x;}
 var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VERT));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 var loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uF=gl.getUniformLocation(pr,'F');
 function tam(){var d=Math.min(window.devicePixelRatio||1,o.dpr||2),w=Math.round(cv.clientWidth*d),h=Math.round(cv.clientHeight*d);
  if(w&&h&&(cv.width!==w||cv.height!==h)){cv.width=w;cv.height=h;gl.viewport(0,0,w,h);}}
 function desenha(t){tam();gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,t);gl.uniform1f(uF,o.forca||1);gl.drawArrays(gl.TRIANGLES,0,3);}
 return {desenha:desenha};
}
window.KFios={inicia:inicia};
})();
