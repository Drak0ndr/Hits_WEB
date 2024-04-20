const linkSpan = document.querySelectorAll('.link span')
const links = document.querySelector('.links')
const link = document.querySelectorAll('.link')
const linkSvg = document.querySelectorAll('.link svg')
let width = document.documentElement.clientWidth
let arr = []
let activeElements = Array(linkSpan.length).fill(0)
linkSpan.forEach(item => {
    arr.push(item.innerHTML)
})
if (width <= 1100 && width > 690) {
    linkSpan.forEach(item => {
        item.innerHTML = ''
    })
    
}
link.forEach(item => {
    item.addEventListener('mouseenter', e => {
        if (e.target.closest('.link') && width <= 1100 && width > 690) {
            let num = +e.target.closest('.link').id - 1
            if (activeElements[num] == 0) {
                linkSvg[num].style.marginRight = '10px'
                let i = 0
                let tempInterval = setInterval(() => {
                    if (i >= arr[num].length - 1) {
                        clearInterval(tempInterval)
                    }
                    linkSpan[num].innerHTML += arr[num][i]
                    i++
                }, 15)
            }
            activeElements[num] = 1
        }
    })
    item.addEventListener('mouseleave', e => {
        if (e.target.closest('.link') && width <= 1100 && width > 690) {
            let num = +e.target.closest('.link').id - 1
  
            let removeInterval = setInterval(() => {
                if (linkSpan[num].innerHTML.length == 0) {
                    clearInterval(removeInterval)
                }

                linkSpan[num].innerHTML = linkSpan[num].innerHTML.slice(0, linkSpan[num].innerHTML.length - 1)
            }, 15)
            activeElements[num] = 0
            linkSvg[num].style.marginRight = '0px'
        }
    })
})

window.addEventListener('resize', e => {
    width = document.documentElement.clientWidth

    if (width <= 1100 && width > 690) {
        linkSpan.forEach(item => {
            item.innerHTML = ''
        })
        
    } else {
        for (let i = 0; i < link.length; i++) {
            linkSpan[i].innerHTML = arr[i]
        }
    }
})
