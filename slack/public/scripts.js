// const username = prompt('What is your username?');
const socket = io('http://localhost:9000/'); // the / namespace/endpoint

socket.on('connect', () => {
  console.log(socket.id);
});

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
      console.log(nsEndpoint);
    });
  });
});
// const socket = io('http://localhost:9000', {
//   query: {
//     username,
//   },
// });
// let nsSocket = '';
// // listen for nsList, which is a list of all the namespaces.
// socket.on('nsList', (nsData) => {
//   console.log('The list of .rooms has arrived!!');
//   // console.log(nsData)
//   let namespacesDiv = document.querySelector('.namespaces');
//   namespacesDiv.innerHTML = '';
//   nsData.forEach((ns) => {
//     namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint} ><img src="${ns.img}" /></div>`;
//   });

//   // Add a clicklistener for each NS
//   console.log(document.getElementsByClassName('namespace'));
//   Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
//     // console.log(elem)
//     elem.addEventListener('click', (e) => {
//       const nsEndpoint = elem.getAttribute('ns');
//       // console.log(`${nsEndpoint} I should go to now`)
//       joinNs(nsEndpoint);
//     });
//   });
//   joinNs('/wiki');
// });
