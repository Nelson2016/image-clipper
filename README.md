# image-clipper (Canvas)

## Clip image by Canvas.drawImage.

## Usage

    //Create container dom
    var container = document.getElementById("containerId");

    //Creat clipper object
    var clipper = new clipper(container, {
        img: document.getElementById('imageDomId'),
        background: 'rgba(0,0,0,.5)',
        initScale: 2,
        height: 200,
        width: 200,
    });
    
    //Get canvas whith content after clipping.
    demo.getResult()