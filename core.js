(function(){

    function createSvgElement(node, attr) {
        var el =  document.createElementNS('http://www.w3.org/2000/svg', node);
        for (var key in attr) el.setAttribute(key, attr[key]);
        return el;
    }

    function generateBlockNumber(row, col) {
        col++; row++;
        return ((col < 10 ? '0' : '')+col) + ((row < 10 ? '0' : '')+row);
    } 

    // Generate hexgrid
    var grid = [12,12];
    var blocks = window.hexblocks = {};
    var offset = {left: 27, top: 15};
    for(var row=0; row<grid[0]; row++) {
        for(var col=0; col<grid[1]; col++) {
            var block = {
                id: generateBlockNumber(row, col),
                left: (offset.left + col * 159) + (row%2 !== 0 ? 80 : 0),
                top: offset.top + row * 138,
                missing: true
            };
            blocks[block.id] = block;
        }
    }

    window.generateMap = function(params) {

        if (!(params.container instanceof HTMLElement)) {
            throw new Error('Container not found.');
        }

        if (params.data && typeof params.data === 'object') {
            for (var key in params.data) {
                if (!blocks[key]) {
                    throw new Error('Hexblock ID "'+key+'" is out of boundary.');
                }
                Object.assign(blocks[key], params.data[key]);
            }
        }

        if (typeof params.createUrl !== 'function') {
            params.createUrl = function(block) {
                return block.id + '.html';
            };
        }

        var hexmap = createSvgElement('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': '100%',
            'id': 'hexmap',
            'viewBox': '0 0 2042 1728',
        });

        params.container.appendChild(hexmap);

        for(var blockNumber in blocks) {
            var block = blocks[blockNumber];

            // Create hexagon path
            var hexagon = createSvgElement('path', {
                'id': 'b' + blockNumber,
                'class': 'ks_hexblock' + (block.missing ? ' missing' : ''),
                'd': [
                    ['M'+(block.left+79),block.top+186].join(','),
                    ['L'+(block.left),block.top+140].join(','),
                    ['L'+(block.left),block.top+46].join(','),
                    ['L'+(block.left+79),block.top+0].join(','),
                    ['L'+(block.left+158),block.top+46].join(','),
                    ['L'+(block.left+158),block.top+140].join(','),
                    ['L'+(block.left+79),block.top+186].join(','),
                    ,'Z'].join(' ')
            });

            // Add hex with or without link
            if (block.missing) {
                hexmap.appendChild(hexagon);
            } else {
                var link = createSvgElement('a', {
                    'href': block.missing ? '' : params.createUrl(block),
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

})();