In Helicopter to get the position of the tip of the bucket:
```
 let tip = vec3.fromValues(0, -13, 2);
                let modelMatrix = mat4.create();

                // Apply bucket transformations to the tip of the bucket
                mat4.translate(modelMatrix, modelMatrix, this.position);
                mat4.rotateY(modelMatrix, modelMatrix, this.orientation);
                mat4.rotateZ(modelMatrix, modelMatrix, this.inclination);
                mat4.rotateY(modelMatrix, modelMatrix, -Math.PI / 2);
                mat4.scale(modelMatrix, modelMatrix, [10 / 16, 10 / 16, 10 / 16]);

                let realTip = vec3.create();
                vec3.transformMat4(realTip, tip, modelMatrix);
```


Waterfall specular component in fragment shader:
```
    float wave = sin((vTextureCoord.x + timeFactor * 0.2) * 20.0) * 0.01;
    float wave2 = cos((vTextureCoord.y + timeFactor * 0.3) * 25.0) * 0.01;

    vec2 distortedCoord = vTextureCoord + vec2(wave, wave2);

    vec4 color = texture2D(uSampler, distortedCoord);

    color.rgb = mix(color.rgb, vec3(0.1, 0.4, 0.8), 0.3); // blue tint
    color.a *= 0.6; 

    // specular
    float highlight = pow(max(dot(vec2(0.5), distortedCoord - 0.5), 0.0), 10.0);
    color.rgb += vec3(0.1, 0.1, 0.15) * highlight;
```

Use for writing documentation.