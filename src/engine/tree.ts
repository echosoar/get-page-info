export class Node {
    nodeName: string = '';
    startIndex: number;
    endIndex: number;
    parentNode: Node;
    childs: Node[] = [];
    content = '';
    allContent = '';
    rank = 0;
}

const checkIsAZ = (char) => {
    if (char >= 'a' && char <= 'z') {
        return true;
    }
    if (char >= 'A' && char <= 'Z') {
        return true;
    }
    return false;
}

const TypeRank = {
    'a': 0.2,
    li: 0.3,
    span: 2,
    strong: 3,
    'pre': 5,
    'code': 10,
    'p': 20,
    'article': 50,
    h1: 100,
}

const NewLineType = {
    'br': 1,
    'div': 1,
    'hr': 1,
    'p': 1
}


export const parseToTree = (html: string) => {
    let charIndex = 0;
    let curNode;
    let nodes = [];
    while(charIndex < html.length) {
        const char = html[charIndex];
        if (char === '<') {
            // a-z || A-Z
            const nextChar = html[charIndex + 1];
            if (checkIsAZ(nextChar)) {
                const newNodeFirstIndex = charIndex;
                const node = new Node();
                charIndex++;
                let nameChars = [html[charIndex]];
                charIndex++;
                while(checkIsAZ(html[charIndex])) {
                    nameChars.push(html[charIndex]);
                    charIndex++;
                }
                charIndex --;
                node.nodeName = nameChars.join('');
                if (curNode) {
                    if (curNode.startIndex !== undefined) {
                        const content = html.slice(curNode.startIndex, newNodeFirstIndex);
                        curNode.content += content;
                        if (NewLineType[node.nodeName]) {
                            curNode.allContent += '\n';
                        }
                        curNode.allContent += content;
                    }

                    node.parentNode = curNode;
                    curNode.childs.push(node);
                }
                curNode = node;
            } else if (nextChar === '/' && curNode) {
                const tmpIndex = charIndex;
                // </
                if (curNode.startIndex !== undefined) {
                    const content = html.slice(curNode.startIndex, charIndex);
                    curNode.content += content;
                    if (NewLineType[curNode.nodeName]) {
                        curNode.allContent += '\n';
                    }
                    curNode.allContent += content;
                }
                charIndex+=2;
                let nameChars = [html[charIndex]];
                charIndex++;
                while(checkIsAZ(html[charIndex])) {
                    nameChars.push(html[charIndex]);
                    charIndex++;
                }
                let closeName = nameChars.join('');

                if (curNode.nodeName !== closeName && curNode.parentNode && curNode.parentNode.nodeName === closeName) {
                    closeName = curNode.nodeName;
                    charIndex = tmpIndex - 2;
                } 

                if (curNode.nodeName === closeName) {
                    // 节点结束
                    if (!curNode.parentNode) {
                        nodes.push(curNode);
                    }
                    curNode.rank = (curNode.childs.reduce((prev, cur) => {
                        return prev + cur.rank;
                    }, 0) + curNode.content.length) * (TypeRank[curNode.nodeName] || 1);
                    const tmpNode = curNode;
                    curNode = curNode.parentNode;
                    if (curNode) {
                        if (NewLineType[tmpNode.nodeName]) {
                            curNode.allContent += '\n';
                        }
                        curNode.allContent += tmpNode.allContent;
                    }
                    delete tmpNode.parentNode;
                    
                } else {
                    // 出错了
                    return [];
                }
                while(html[charIndex] !== '>') {
                    charIndex++;
                }
                if (curNode) {
                    curNode.startIndex = charIndex + 1;
                }
                continue;
                
            }
        } else if (char === '/' && html[charIndex + 1] === '>') {
            // 结束标签
            if (!curNode.parentNode) {
                nodes.push(curNode);
            }

            curNode.rank = (curNode.childs.reduce((prev, cur) => {
                return prev + cur.rank;
            }, 0) + curNode.content.length) * (TypeRank[curNode.nodeName] || 1);

            const tmpNode = curNode;
            curNode = curNode.parentNode;
            if (curNode) {
                if (NewLineType[tmpNode.nodeName]) {
                    curNode.allContent += '\n';
                }
                curNode.allContent += tmpNode.allContent;
            }
            

            delete tmpNode.parentNode;
            if (curNode) {
                curNode.startIndex = charIndex + 2;
            }
            charIndex +=2;
        } else if (char === '>') {
            if (curNode) {
                curNode.startIndex = charIndex + 1;
            }
        }
        charIndex ++;
    }
    return nodes;
}


export const findMainNode = (nodes: Node[]): Node => {
    if (!nodes.length) {
        return;
    }
    if (nodes.length === 1) {
        return nodes[0];
    }
    nodes.sort((a, b) => {
        return b.rank - a.rank;
    });
    if (nodes[0].rank < nodes[1].rank * 2) {
        return;
    }

    const node = nodes[0];
    const childWithMainNode = findMainNode(node.childs);
    if (childWithMainNode) {
        return childWithMainNode;
    }
    return node;
}