const board = document.getElementById('board')
const solver = document.getElementById('solve')
const clear = document.getElementById('clear')
const nope = document.getElementById('nope')

let grid = []
let av = []
let showGrid = []
let steps = []
let dim = Math.min(window.innerHeight,window.innerWidth)
let solving = false
let win = false
let start = false

board.style.top = `${(window.innerHeight - dim)/2}px`
board.style.left = `${(window.innerWidth - dim)/2}px`

if(window.innerHeight > window.innerWidth){
    solver.style.top = `${(window.innerHeight/36) * 2}px`
    solver.style.left = `${(window.innerWidth/3) - ((parseInt(window.getComputedStyle(solver).width)) + (window.innerHeight/36) * 3)/2}px`
    solver.style.fontSize = `${window.innerHeight/32}px`    
    solver.style.padding = `${window.innerHeight/36}px`
    clear.style.top = `${(window.innerHeight/36) * 2}px`
    clear.style.left = `${(window.innerWidth/3) + ((parseInt(window.getComputedStyle(clear).width)) + (window.innerHeight/36) * 4)/2}px`
    clear.style.fontSize = `${window.innerHeight/32}px`    
    clear.style.padding = `${window.innerHeight/36}px`
}
else{
    solver.style.top = `${(window.innerHeight/3) - ((parseInt(window.getComputedStyle(solver).height)) + (window.innerWidth/36) * 3)/2}px`
    solver.style.left = `${(window.innerWidth/36) * 2}px`
    solver.style.fontSize = `${window.innerWidth/32}px`    
    solver.style.padding = `${window.innerWidth/36}px`
    clear.style.top = `${(window.innerHeight/3) + ((parseInt(window.getComputedStyle(clear).height)) + (window.innerWidth/36) * 4)/2}px`
    clear.style.left = `${(window.innerWidth/36) * 2}px`
    clear.style.fontSize = `${window.innerWidth/32}px`    
    clear.style.padding = `${window.innerWidth/36}px`
}

for(let j = 0; j < 9; j++){
    let mrkp = ''
    grid.push([])
    showGrid.push([])
    av.push([])
    for(let i = 0; i < 9; i++){
        grid[j].push([' ',1,2,3,4,5,6,7,8,9])
        av[j].push([1,2,3,4,5,6,7,8,9])
        showGrid[j].push(' ')
        let color = 'rgb(0, 100, 100);'
        if(((i < 3 || i > 5) && (j < 3 || j > 5)) || ((i > 2 && i < 6) && (j > 2 && j < 6))){
            color = 'rgb(0, 50, 50);'
        }
        mrkp += `<div class="block" style="width: ${(dim/9) - 4}px;height: ${(dim/9) - 4}px; margin: 2px; background-color: ${color}; font-size: ${(dim/9) - 6}px;" id="${j}${i}" onclick="change(${j},${i})"> </div>`
    }
    let markup = `<div class="row" id="${j}">${mrkp}</div>`
    board.insertAdjacentHTML('beforeend',markup)
}

for(let j = 0; j < 9; j++){
    for(let i = 0; i < 9; i++){
        document.getElementById(`${j}${i}`).innerText = showGrid[j][i]
    }
}


function change(j,i){
    if(win == false){
        entropy()
        let ind = grid[j][i].indexOf(showGrid[j][i])
        if(ind == -1){
            ind = grid[j][i].length + 1
            for(let g = 0; g < grid[j][i].length; g++){
                if(showGrid[j][i] <= grid[j][i][g] && g < ind){
                    ind = g - 1
                }
            }
            if(ind == grid[j][i].length + 1){
                ind = -1
            }
        }
        showGrid[j][i] = grid[j][i][(ind + 1)%grid[j][i].length] 
        document.getElementById(`${j}${i}`).innerText = showGrid[j][i]
    }
}

function entropy(){
    for(let j = 0; j < 9; j++){
        for(let i = 0; i < 9; i++){
            grid[j][i] = [' ',1,2,3,4,5,6,7,8,9]
            if(showGrid[j][i] == ' '){
                av[j][i] = [1,2,3,4,5,6,7,8,9]
                // console.log('OK',j,i);
            }
            box(j,i).forEach(e => {
                if(grid[j][i].includes(e)){
                    grid[j][i].splice(grid[j][i].indexOf(e),1)
                }
            });
            row(j).forEach(e => {
                if(grid[j][i].includes(e)){
                    grid[j][i].splice(grid[j][i].indexOf(e),1)
                }
            });
            coloumn(i).forEach(e => {
                if(grid[j][i].includes(e)){
                    grid[j][i].splice(grid[j][i].indexOf(e),1)
                }
            });
        }
    }
    if(solving){
        solve()
    }
}

function box(j,i){
    let indi = Math.floor(i/3)*3
    let indj = Math.floor(j/3)*3
    let ans  = []
    for(let x = 0; x < 3; x++){
        for(let y = 0; y < 3; y++){
            if(showGrid[indj + x][indi + y] != ' '){
                ans.push(showGrid[indj + x][indi + y])
            }
        }
    }
    return ans
}

function coloumn(i){
    let ans = []
    for(let j = 0; j < 9; j++){
        if(showGrid[j][i] != ' '){
            ans.push(showGrid[j][i])
        }
    }
    return ans
}

function row(j){
    let ans = []
    for(let i = 0; i < 9; i++){
        if(showGrid[j][i] != ' '){
            ans.push(showGrid[j][i])
        }
    }
    return ans
}

function leastEntrpy(){
    let ans = []
    let l = 10
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(grid[i][j].length < l && showGrid[i][j] == ' ' && l != 1){
                l = grid[i][j].length
                ans = [i,j]
            }
        }
    }
    return [l,ans]
}

function dlt(s){
    if(steps.length == 0 && start){
        nope.style.display = 'block'
        setTimeout(unsolve,3000)
        solving = false
        start = false
        // let markup = ``
        return null
    }
    let lst = s[s.length - 1]
    let opts = grid[lst[0]][lst[1]].slice(1,grid[lst[0]][lst[1]].length)
    // console.log(opts,'OPTS',lst,'LST',grid[lst[0]][lst[1]],'GRID');
    let remov = []
    if(opts.length != 0){
        for(let i = 0; i < opts.length; i++){
            // console.log(av[lst[lst.length - 1][0]][lst[lst.length - 1][1]],opts,showGrid[lst[lst.length - 1][0]][lst[lst.length - 1][1]]);
            if(av[lst[0]][lst[1]].includes(opts[i]) == false){
                // opts.splice(opts.indexOf(av[lst[0]][lst[1]][i]),1)
                remov.push(opts[i])
                // console.log(remov,'REMOVE');
            }
        }
        remov.forEach(e => {
            opts.splice(opts.indexOf(e),1)
        });
    }
    if(opts.length == 0){
        // console.log('HA');
        showGrid[lst[0]][lst[1]] = ' '
        // console.log(av[lst[0]][lst[1]],opts,s);
        // av[lst[0]][lst[1]] = [1,2,3,4,5,6,7,8,9]
        s.pop()
        solving = false
        entropy()
        return dlt(s)
    }
    let res = s[s.length - 1]
    // console.log(res,'LST');
    solving = true
    return res
}

function solve(){
    start = true
    let ai;
    le = leastEntrpy()
    if(le[0] != 1){
        steps.push(le[1])
        ai = le[1]
    }
    else{
        ai = dlt(steps)
        if(ai == null){
            return
        }
    }
    // console.log(ai,av[ai[0]][ai[1]]);
    if(check()){
        solving = false
        win = true
    }
    else{
        set(ai[0],ai[1])
    }
}

function set(i,j){
    let opts = grid[i][j].slice(1,grid[i][j].length)
    let remov = []
    for(let x = 0; x < opts.length; x++){
        if(av[i][j].includes(opts[x]) == false){
            remov.push(opts[x])
        }
    }
    remov.forEach(e => {
        opts.splice(opts.indexOf(e),1)
    });
    let rand = Math.floor(Math.random() * opts.length)
    showGrid[i][j] = opts[rand]
    av[i][j].splice(av[i][j].indexOf(opts[rand]),1)
    // console.log(i,j);
    document.getElementById(`${i}${j}`).innerText = showGrid[i][j]
    entropy()
}

solver.addEventListener('click',()=>{
    let flag = false
    // console.log(grid);
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(showGrid[i][j] != ' '){
                flag = true
            }
        }
    }
    if(flag){
        solving = true
        entropy()
    }
})

function check(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(showGrid[i][j] == ' '){
                return false
            }
        }
    }
    return true
}

function unsolve(){
    nope.style.display = 'none'
}

clear.addEventListener('click',()=>{
    location.reload()
})