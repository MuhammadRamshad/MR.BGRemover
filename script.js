document.addEventListener('DOMContentLoaded',() =>{
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const selectButton = document.getElementById("selectButton");
    const originalImage = document.getElementById("originalImage");
    const processedImage = document.getElementById("processedImage");
    const removeBackgroundBtn = document.getElementById("removeBackground");
    const downloadBtn = document.getElementById("download");
    const loading = document.querySelector(".loading");
    //loading
    loading.style.display = "none";
    //File input
    //drag

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      console.log(file);
      if(file && file.type.startsWith('image/')){
        //upload
        handleImageUpload(file);
      }


    });

    //select
    selectButton.addEventListener('click',()=>{
        fileInput.click();
    });
    fileInput.addEventListener('change',(e)=>{
        const file = e.target.files[0]
        if(file){
            handleImageUpload(file);
        }
    })

    //handle upload
    function handleImageUpload(file){
        const reader = new FileReader()
        
        reader.onload = (e) => {
            console.log(e.target.result);
            originalImage.src = e.target.result;
            originalImage.hidden = false;
            processedImage.hidden = true;
            removeBackgroundBtn.disabled = false;
            downloadBtn.disabled = true;
        }
        reader.readAsDataURL(file);
    }

    //remove bg
    removeBackgroundBtn.addEventListener('click', async()=>{
        //load
        loading.style.display = 'flex';
        try {
            const formData = new FormData();
            //blob
            const blob = await fetch(originalImage.src).then((r)=>r.blob())
            //https://api.slazzer.com/v2.0/remove_image_background
            formData.append('source_image_file',blob);
            const response = await fetch("https://api.slazzer.com/v2.0/remove_image_background",{
                method:'POST',
                headers:{
                    "API-KEY":"API Key",
                },
                body: formData,
            });
            const blob_response = await response.blob();
            const url = URL.createObjectURL(blob_response);
            processedImage.src = url;
            processedImage.hidden = false;
            downloadBtn.disabled = false;

        } catch (error) {
            
        }finally{
            //hide the loading
            loading.style.display = "none";
        }
    })
    
    downloadBtn.addEventListener('click', ()=>{
        const link = document.createElement("a");
        link.href = processedImage.src;
        link.download = 'processed_image.png';
        link.click();
    })
})