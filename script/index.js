const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {

    fetch('https://openapi.programming-hero.com/api/levels/all')

        .then(res => res.json())

        .then(data => displayLessons(data.data));

};

const removeActive = ()=>{
    const lessonBtn = document.querySelectorAll('.lesson-btn');
    lessonBtn.forEach(btn=>btn.classList.remove('active'))
}

const loadLevelWord = (id)=>{
  manageSpinner(true)
   const url = `https://openapi.programming-hero.com/api/level/${id}`;
   fetch(url)
   .then(res => res.json())
   .then(data => {
    removeActive()
    const clickBtn = document.getElementById( `lesson-level-${id}`  )
    clickBtn.classList.add('active')
    displayLevelWord(data.data)
})
}

const displayLessons = (lessons)=>{
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';
    for(let lesson of lessons){
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
        <button href="" id="lesson-level-${lesson.level_no}" onclick=loadLevelWord(${lesson.level_no}) class="btn lesson-btn btn-outline btn-primary"><i class="fa-solid fa-circle-question"></i>Leesson ${lesson.level_no}</button>
        `;
        levelContainer.appendChild(buttonDiv)
    };
}
const manageSpinner = (status)=>{
  if(status === true){
    document.getElementById('spinner').classList.remove('hidden')
    document.getElementById('word-container').classList.add('hidden')
  }
  else{
     document.getElementById('spinner').classList.add('hidden')
    document.getElementById('word-container').classList.remove('hidden')
  }
}
const displayLevelWord = (words)=>{
const wordContainer = document.getElementById('word-container');
 wordContainer.innerHTML = '';
 if(words.length === 0) {
    wordContainer.innerHTML = `
    <div class="text-center col-span-full rounded-r-xl py-10 space-y-6">
        <img class="mx-auto" src="./assets/alert-error.png" />
          <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোনো Vocabulary  যুক্ত করা হয়নি</p>
          <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
    `
    manageSpinner(false)
 }
    words.forEach(word => {
        const card = document.createElement('div');
        card.innerHTML = `
         <div class="rounded-xl shadow-lg text-center py-10 px-5 space-y-4 hover:scale-105">
          <h2 class="text-2xl font-bold">${word.word ? word.word : 'কোনো শব্দ পাওয়া যায়নি'}</h2>
          <p class="font-semibold">meaning/pronounciation</p>
          <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning :"'  Meaning পাওয়া যায়নি'"} / ${word.pronunciation ? word.pronunciation : "'  Pronounciation পাওয়া যায়নি'"}</div>
          <div class="flex justify-between items-center">
            <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10]"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
        `
        wordContainer.appendChild(card)
        
    });
    manageSpinner(false)

}

const loadWordDetails = async(id)=>{
     const url = `https://openapi.programming-hero.com/api/word/${id}`;
     const res = await fetch(url);
     const details = await res.json();
     displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  // console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
    <div class="">
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Synonym</h2>
          <div class="">${createElements(word.synonyms)}</div>
          </div>
    
    
    `;
    //   
  document.getElementById("word_modal").showModal();
};

loadLessons();

document.getElementById("search-btn").addEventListener("click", (e) => {
  removeActive()
    
    const input = document.getElementById("search-input").value;

    const searchText = input.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {

            const allWords = data.data;

            console.log(allWords);

            const filterWords = allWords.filter((word) =>
                word.word.toLowerCase().includes(searchText)
            );

            displayLevelWord(filterWords);
        });
});