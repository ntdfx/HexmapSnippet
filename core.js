(function(){

    function createSvgElement(node, attr) {
        var el =  document.createElementNS('http://www.w3.org/2000/svg', node);
        for (var key in attr) el.setAttributeNS(null, key, attr[key]);
        return el;
    }

    function generateBlockNumber(row, col) {
        col++; row++;
        return ((col < 10 ? '0' : '')+col) + ((row < 10 ? '0' : '')+row);
    } 

    // Generate hexgrid
    var grid = [12,12];
    var blockNumberingCurr = 0;
    var blocks = window.hexblocks = {};
    var offset = {left: 27, top: 15};
    for(var row=0; row<grid[0]; row++) {
        for(var col=0; col<grid[1]; col++) {
            var block = {
                id: generateBlockNumber(row, col),
                left: (offset.left + col * 159.5) + (row%2 !== 0 ? 80 : 0),
                top: offset.top + row * 137.7,
                missing: true
            };
            blocks[block.id] = block;
        }
    }

    function generateMap() {
        var hexmap = document.getElementById('hexmap');
        for(var blockNumber in blocks) {
            var block = blocks[blockNumber];

            // Create hexagon path
            var hexagon = createSvgElement('path', {
                'id': 'b' + blockNumber,
                'class': 'ks_hexblock' + (block.missing ? ' missing' : ''),
                'd': [
                    ['M'+(block.left+77),block.top+180].join(','),
                    ['L'+(block.left),block.top+134].join(','),
                    ['L'+(block.left),block.top+45].join(','),
                    ['L'+(block.left+77),block.top+0].join(','),
                    ['L'+(block.left+155),block.top+45].join(','),
                    ['L'+(block.left+155),block.top+134].join(','),
                    ['L'+(block.left+77),block.top+180].join(','),
                    ,'Z'].join(' ')
            });

            // Add hex with or without link
            if (block.missing) {
                hexmap.appendChild(hexagon);
            } else {
                var link = createSvgElement('a', {
                    'href': block.missing ? '' : generateURIForHexblock(block),
                    'target': '_blank',
                });
                link.appendChild(hexagon);
                hexmap.appendChild(link);
            }

            // Create indicator text with shadow
            var indicatorText = block.missing ? "✘" : "✔";
            var indicatorShadow = createSvgElement('text', {
                'class': 'ks_hexblock_indicator_shadow',
                'x': block.left + 30+2,
                'y': block.top + 80+2,
                'text-anchor': 'middle',
            });

            var indicator = createSvgElement('text', {
                'class': 'ks_hexblock_indicator' + (block.missing ? ' missing' : ''),
                'x': block.left + 30,
                'y': block.top + 80,
                'text-anchor': 'middle',
            });

            indicatorShadow.appendChild(document.createTextNode(indicatorText));
            indicator.appendChild(document.createTextNode(indicatorText));

            hexmap.appendChild(indicatorShadow);
            hexmap.appendChild(indicator);

        }
    }

    setTimeout(function(){
        generateMap();
    });

})();