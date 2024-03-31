const inputFile = document.querySelector('.inputfile')
const label = document.querySelector('.load_data label')
inputFile.addEventListener('change', (e) => {
    let file = inputFile.files[0]
    label.innerHTML = file.name
    let reader = new FileReader();
    reader.readAsText(file)
    reader.onload = () => {
        console.log(reader.result)
    }
})