document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("userData"));

  if (user) {
    const links = document.getElementById("links");
    links.innerHTML = `
      <button class="text-white text-2xl px-4 py-2 hover:text-purple-400">
        <i class="fas fa-user-circle"></i>
      </button>
      <a href="setting.html" class="text-white text-2xl px-4 py-2 hover:text-purple-400 inline-block">
        <i class="fas fa-cog"></i>
      </a>
    `;
  }

  getdata().then(() => {
    setupLikeButtons();
    setupPlayButtons();
  });
});

const url = "https://sonix-s830.onrender.com/api/songs";

async function getdata() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById("music-list");
    container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6";

    data.forEach(song => {
      let div = document.createElement('div');
      div.className = "bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300";

      div.innerHTML = `
        <div class="relative group w-[60%] h-48 mx-auto">
          <img src="${song.previewImg}" alt="${song.title}" class="w-full h-full object-cover rounded-md">
          <button class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 play-btn" data-id="${song._id}">
            <i class="fa-solid fa-circle-play text-white text-4xl bg-black bg-opacity-50 rounded-full p-2"></i>
          </button>
        </div>

        <div class="p-4">
          <h2 class="text-xl font-bold text-white mb-1">${song.title}</h2>
          <p class="text-sm text-purple-300 mb-3">${song.artistName}</p>
          
          <audio id="audio-${song._id}" controls class="w-full">
            <source src="${song.songUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
          <button class="like-btn text-white bg-purple-400 hover:bg-purple-700 px-3 py-1 rounded-full transition duration-300 flex items-center gap-2 m-4">
            <i class="fa-regular fa-heart"></i> Like
          </button>
          <span class="like-count">0 Likes</span>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching songs:", err);
  }
}

function setupLikeButtons() {
  const likeButtons = document.querySelectorAll('.like-btn');
  likeButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    const countspan = btn.nextElementSibling;
    let liked = false;
    let count = 0;

    btn.addEventListener('click', () => {
      liked = !liked;
      count += liked ? 1 : -1;
      countspan.textContent = `${count} Likes`;

      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');

      btn.classList.toggle('bg-purple-400');
      btn.classList.toggle('bg-purple-700');
    });
  });
}

function showForm(type) {
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('signupForm').style.display = type === 'signup' ? 'block' : 'none';
}

function showForm(type) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById(type + 'Form').classList.remove('hidden');
}
function setupPlayButtons() {
  const playButtons = document.querySelectorAll('.play-btn');

  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const audioId = btn.getAttribute('data-id');
      const audio = document.getElementById(`audio-${audioId}`);

      if (!audio) {
        console.error(`Audio element not found for ID: ${audioId}`);
        return;
      }

      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
      });

      if (audio.paused || audio.ended) {
        audio.play().catch(err => {
          console.error("Playback failed:", err);
        });
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  });
}

