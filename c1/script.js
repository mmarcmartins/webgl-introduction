const vertexShaderText = [
  'precision mediump float;', 
  '', 
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',  
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  'gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}'
].join('\n');

const fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  'gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');

function InitiDemo(){

  const canvas = document.getElementById('game-surface');
  const gl = canvas.getContext('webgl');

  gl.clearColor(0.75,0.85,0.8,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // create shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);

  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling vertex shader !', gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling fragment shader !', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program,vertexShader);
  gl.attachShader(program,fragmentShader);

  gl.linkProgram(program);

  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('ERROR linking program', gl.getProgramInfoLog(program));
    return;
  }

  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    console.error('ERROR validating program', gl.getProgramInfoLog(program));
    return;
  }

  /*
    Create Buffer
  */

  const triangleVertices = 
  [ // X, Y   // R G B
    0.0,0.5,   1.0,0.5,0.0,
    -0.5,-0.5, 0.7,0.0,1.0,
    0.5,-0.5,  0.0,1.0, 0.6
  ];


  const triangleVertexBufferObj = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObj);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  
  const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    posAttribLocation, //attribute location
    2, //number of elements per attribute
    gl.FLOAT, // type of elements,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,// size of and individual vertex
    0// offset from the beginning of a single vertex to this attribute
  );

  gl.vertexAttribPointer(
    colorAttribLocation, //attribute location
    3, //number of elements per attribute
    gl.FLOAT, // type of elements,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,// size of and individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT// offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(posAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}

/*function vertexShader(vertPosition, vertColor){
  return{
    fragColor: vertColor,
    gl_position: [vertPosition.x, vertPosition.y, 0.0,1.0]
  }
}*/
