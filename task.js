const pollTitle = document.getElementById('poll__title');
const pollAnswers = document.getElementById('poll__answers');

function loadPoll() {
  fetch('https://students.netoservices.ru/nestjs-backend/poll')
    .then(response => response.json())
    .then(data => {
      renderPoll(data);
    })
    .catch(error => console.error('Ошибка загрузки опроса:', error));
}

function renderPoll(data) {
  pollTitle.textContent = data.data.title;
  pollAnswers.innerHTML = '';

  data.data.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.classList.add('poll__answer');
    button.textContent = answer;
    button.addEventListener('click', () => {
      sendVote(data.id, index);
    });
    pollAnswers.appendChild(button);
  });
}

function sendVote(pollId, answerIndex) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/poll');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(`vote=${pollId}&answer=${answerIndex}`);

  xhr.onload = function() {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
      showResults(result.stat);
      alert('Спасибо, ваш голос засчитан!');
    }
  };
}

function showResults(stat) {
  pollTitle.textContent = 'Результаты голосования:';
  pollAnswers.innerHTML = '';

  stat.forEach(item => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('poll__answer');
    resultItem.textContent = `${item.answer}: ${item.votes} голосов`;
    resultItem.style.cursor = 'default';
    resultItem.style.marginBottom = '10px';
    resultItem.style.fontWeight = 'bold';
    pollAnswers.appendChild(resultItem);
  });
}

loadPoll();