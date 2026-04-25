import {
  auth,
  db,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "./firebase.js";

let user = null;

window.login = async function () {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  const res = await signInWithEmailAndPassword(auth, email, pass);
  user = res.user;

  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  loadProducts();
};

window.saveProduct = async function () {
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);

  await addDoc(collection(db, "products"), {
    name,
    price,
    userId: user.uid
  });

  loadProducts();
};

async function loadProducts() {
  const q = query(collection(db, "products"), where("userId", "==", user.uid));
  const snap = await getDocs(q);

  const list = document.getElementById('list');
  list.innerHTML = '';

  snap.forEach(doc => {
    const p = doc.data();
    list.innerHTML += `<div>${p.name} - R$ ${p.price}</div>`;
  });
}

window.startCamera = async function () {
  const video = document.getElementById('video');

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  video.srcObject = stream;
  video.classList.remove('hidden');
  video.play();
};
