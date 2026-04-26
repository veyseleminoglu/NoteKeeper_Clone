const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

//html elementlerine ulas
const addBox = document.querySelector(".add-box")
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("#popup-title");
const popupButton = document.querySelector("#form-btn");

//verı alanları
const NOTES = "notes"

let notes = JSON.parse(localStorage.getItem(NOTES)) || []


let isUpdate = false 
let updateId = null 

document.addEventListener("DOMContentLoaded", renderNotes(notes))

//notlari render et
function renderNotes(notes){

    /*notes dizisinde yer alan her note elemani icin bir arayuz elemani render et 
    renderNotes fonksiyonu her calistirildiginda bizim icin her seferinden once eklenen
    note"lari tekrar render ediyor. Bu durumu duzeltmek icin her renderNotes fonksiyonu
    cagirildiginda arayuzdeki .notes classina sahip tum elemanlari kaldir
    */
    document.querySelectorAll(".note").forEach((noteItem)=>noteItem.remove())
    
    console.log(notes)

    notes.forEach((note)=>{
        let noteHtml = `      <div class="note" data-id=${note.id} >
       
        <div class="details">
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>

     
        <div class="bottom">
          
          <p>${note.date}</p>

         
          <div class="settings">
         
            <i class="bx bx-dots-horizontal-rounded"></i>

        
            <ul class="menu">
              <li class="edit-icon"><i class="bx bx-edit"></i> Edit</li>
              <li class="delete-icon">
                <i class="bx bx-trash"></i>
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>`;


      addBox.insertAdjacentHTML("afterend",noteHtml)
    })

}
//addBoc tiklanidliginda
addBox.addEventListener("click",showFormAndSetup)


//formu goster ve duzenle
function showFormAndSetup(){
    popupBox.classList.add("show")
    popup.classList.add("show")

    document.body.style.overflow = "hidden"
}

//kapatma tusuna basinca
closeBtn.addEventListener("click",clearFormAndRemove)

//formu temizle ve kaldir
function clearFormAndRemove() {
    
    popupBox.classList.remove("show")
    popup.classList.remove("show")

    document.body.style.overflow = "auto"

    form.reset()

   makePopupDefault()
}

//form alanlari varsayilana cek
function makePopupDefault() {
    popupTitle.textContent = "New Note"
    popupButton.textContent = "Add"
    isUpdate = false
    updateId = null
}

//form submit oldugunda
form.addEventListener("submit", (e)=>{
    e.preventDefault()

    const titleInput = e.target[0]
    const descriptionInput = e.target[1]

    const title = titleInput.value
    const description = descriptionInput.value

    if (!title || !description) {
        alert("alanlar bos olamaz")
        return
    }

    const date = new Date()

   const day = date.getDate()
   const month = date.getMonth()
   const updateMonth = months[month]
   const year = date.getFullYear()
   const id = date.getTime()


   if (isUpdate) {
    //guncelleme oluyorsa
    const updateIndex = notes.findIndex((note)=> note.id == updateId)

    notes[updateIndex] = {
        title,
        description,
        date: `${updateMonth} ${day},${year} `,
        id
    }

    makePopupDefault()
    
   } else {
    let noteItem = {
        title,
        description,
        date: `${updateMonth} ${day},${year} `,
        id
    }
    notes.push(noteItem)
   }

   localStorage.setItem(NOTES,JSON.stringify(notes))

   clearFormAndRemove()

   renderNotes(notes)
})


//wrapper tiklanilan elemani bul
wrapper.addEventListener("click",(e)=>{

    if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
        //menuyu goster
        showMenu(e.target)
    } else if(e.target.classList.contains("delete-icon")) {
        //silme islemi
        deleteNote(e.target)
    } else if (e.target.classList.contains("edit-icon")){
        //notu guncelle
        editNote(e.target)
    }
})

//guncelle tiklanirsa
function editNote(item) {
    const note = item.closest(".note")
    const noteId = parseInt(note.dataset.id)

    const foundNote = notes.find((note)=> note.id == noteId)

    showFormAndSetup()

    form[0].value = foundNote.title
    form[1].value = foundNote.description

    isUpdate = true
    updateId = noteId

    popupTitle.textContent = "Notu Guncelle"
    popupButton.textContent = "Guncelle"

    
}

//menuyu goster
function showMenu(item) {
    //kapsayicisina eris, parentElement ile olur
    const parentElement = item.parentElement
    parentElement.classList.add("show")

    document.addEventListener("click",(e)=>{

        if (e.target.tagName != "I" || e.target != item) {
            parentElement.classList.remove("show")
        }
    })

}

//silmeye tiklanildiginda
function deleteNote(item) {
    
    const response = confirm("Silmek istedigine emin misin")

    if (response) {
        
        const noteItem = item.closest(".note")

        const noteId = Number(noteItem.dataset.id)

        notes = notes.filter((note)=>note.id != noteId)

        localStorage.setItem(NOTES,JSON.stringify(notes))

        renderNotes(notes)
    } 

}