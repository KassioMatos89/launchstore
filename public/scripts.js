const Mask = {
    apply(input, func) {
        setTimeout(function() {
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {

        value = value.replace(/\D/g,"")

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)
    }
}

const PhotosUpload = {

    input: "",

    preview: document.querySelector('#photos-preview'),
    
    //Definindo número máximo de arquivos no upload.
    uploadLimit: 6,

    // Declaração de config "files" para controlarmos nosso array de fotos
    files: [],

    handleFileInput(event) {

        // Pegando os arquivos que foram selecionados no input
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        // 
        if ( PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            // Váriavel que tera acesso e fara leitura dos arquivos.
            const reader = new FileReader()

            reader.onload = () => {

                const image = new Image // Mesma coisa que criar um <img> no html

                // Setando o caminho da imagem para exibição como atributo.
                image.src = String(reader.result)

                //Chama a função getContainer para criar a div de class photo
               const div = PhotosUpload.getContainer(image)

                //Colocar a nova div dentro da div preview
                PhotosUpload.preview.appendChild(div)
                
            }

            PhotosUpload.input.files = PhotosUpload.getAllFiles()

            reader.readAsDataURL(file)
        })
    },

    // Função que serve para validar se a quantidade de imagens importadas está de acordo com o configurado.\
    hasLimit(event) {

        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if ( fileList.length > uploadLimit ) {
            alert (`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []

        preview.childNodes.forEach( item => {
            // Pegando apenas os childNodes que possuem class photo
            if ( item.classList && item.classList.value == "photo" ) {
                //Adiciona no array o item (div photo)
                photosDiv.push(item)                
            }
        })

        const totalPhotos = fileList.length + photosDiv.length

        if ( totalPhotos > uploadLimit ) {
            alert(`Você atingiu o limite máximo ${uploadLimit} de fotos`)
            event.preventDefault()
            return true
        }

        return false
    },

    // Esta função irá inserir tudo que esta no nosso config PhotosUpload.files dentro do files de dataTransfer.items
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach( file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    // Função que cria a div para a imagem e a insere de acordo com a imagem passada no argumento.
    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    // Função que cria o botão de remoção (x) do material icons na tela
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    // Função que deleta a div imagem da tela
    removePhoto(event) {
        // O parentNode pega o elemento pai de event.target, neste caso(<i>), então sua div pai é '.photo'
        const photoDiv = event.target.parentNode // <div class="photo">

        //Transforma em array as divs filhas de #photos-preview que no caso são as divs .photo
        const photosArray = Array.from(PhotosUpload.preview.children)

        // Declaramos index pegando o index dele no array.
        const index = photosArray.indexOf(photoDiv)

        // O splice é utilizado para remover um elemento do array, e o segundo parametro indica quantos elementos serão removidos.
        PhotosUpload.files.splice(index, 1)

        // Atualizando o target de acordo com nosso config files através da func getAllFiles()
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        // Por ultimo removemos a div com remove
        photoDiv.remove()
    }
}