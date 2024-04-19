export class Draw {
    constructor(field, root) {
        this.field = field
        this.root = root
    }

    clear() {
        this.field.innerHTML = '<ul></ul>'
    }
    drawNode(graph, ind, parent, predictInd, path = [-1]) {
        // console.log(this.field, this.root)
        let elem = ''
        let color = 'white'
        if (path.indexOf(ind) > -1) {
            color = '#ffb7b7'
        }
        if (ind == predictInd) {
            color = '#eba68d'
        }
        elem = ['<li>',
            '<a href="#" style="background-color:', color, '">','Arg', graph[ind].numArg, ' <= ', graph[ind].condition, '</a>',
            '<ul>',
            '<li>','<a href="#">','yes', '</a>',
            '<ul>','</ul>',
            '</li>',
            '<li>','<a href="#">','no', '</a>',
            '<ul>','</ul>',
            '</li>',
            '</ul>',
            '</li>'].join('')
        if (graph[ind].left <=0 && graph[ind].right <=0) {
            elem = ['<li>',
            '<a href="#" style="background-color:', color, '">', graph[ind].data[0][graph[ind].data[0].length - 1], '</a>',
        '</li>'].join('')
        }

        parent.insertAdjacentHTML('beforeend', elem)
        let newParents = parent.querySelectorAll('ul li ul')
        
        if (graph[ind].left > 0) {
            this.drawNode(graph, graph[ind].left, newParents[1], predictInd, path)
        }
        if (graph[ind].right > 0) {
            this.drawNode(graph, graph[ind].right, newParents[2], predictInd, path)
        }
    }

    drawGraph(graph, predictInd, path = [-1]) {
        
        this.root = this.field.querySelector('ul')
        this.drawNode(graph, 0,this.root, predictInd, path)
    }

}