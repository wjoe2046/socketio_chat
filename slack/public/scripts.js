// const username = prompt('What is your username?');
const socket = io('http://localhost:9000/'); // the / namespace/endpoint
let nsSocket = '';

socket.on('nsList', (nsData) => {
  console.log('the list namespaces has arrived');
  console.log(nsData);
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endPoint}><img src="${ns.img}"/></div>`;
  });

  //add a click listener
  Array.from(document.getElementsByClassName('namespace')).forEach((ele) => {
    ele.addEventListener('click', (e) => {
      const nsEndpoint = ele.getAttribute('ns');
      joinNs(nsEndpoint);
    });
  });
  joinNs('/wiki');
});
