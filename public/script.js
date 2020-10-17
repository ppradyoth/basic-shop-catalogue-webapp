// For Firebase JS SDK v7.20.0 and later, measurementId is optional

  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore();
  var storage = firebase.storage();
  
  function login() {
      var email = document.getElementById("lemail").value;
      var password = document.getElementById("lpassword").value;
  
      console.log(email, password)
  
              firebase.auth()
              .signInWithEmailAndPassword(email, password)
              .then(function(firebaseUser) {
                  console.log("Success")
              })
              .catch(error => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorMessage)
              });
  }
  
  function signup() {
      var email = document.getElementById("semail").value;
      var password = document.getElementById("spassword").value;
  
      firebase.auth()
          .createUserWithEmailAndPassword(email, password)
          .then(Response => {
              console.log('success')
          })
          .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage)
          });
  }
  
  function logout() {
      firebase.auth()
      .signOut()
      .then(function() {
          console.log("logged out")
      }).catch(function(error) {
          console.log(error.message)
      }); 
  }
  
  
  function getShopCard(name, image, id){
      return `
      <div class="column is-3" style="float:left;">
          <div class="card">
          <div class="card-image">
              <figure class="image is-4by3">
                  <img src="${image}" alt="Placeholder image">
              </figure>
              </div>
              <div class="card-content">
              <p class="title is-4">${name}</p>
              </div>
              <footer class="card-footer">
              <a onclick="deleteResturant('${id}')" href="#" class="card-footer-item">Delete</a>
              </footer>
          </div>
      </div>
      `
      }
  
  function renderShops(){
      db.collection("resturants").onSnapshot(function (querySnapshot) {
          var temp = ''
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              // temp += doc.data().name + '</br>';
              // temp += `${doc.data().name} <button onclick="deleteResturant('${doc.id}')">Delete</button> </br>`;
  
              var image = 'https://bulma.io/images/placeholders/1280x960.png'
              if (doc.data().fileLink != null){
                  image = doc.data().fileLink
              }
  
              temp += getShopCard(doc.data().name, image , doc.id)
          });
          document.getElementById("rlist").innerHTML = temp
      });
  }
  
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          console.log(user)
          document.getElementById("login").style.display = 'none'
          document.getElementById("register").style.display = 'none'
          document.getElementById("dashboard").style.display = 'block'
  
          renderShops()
  
      } else {
          document.getElementById("login").style.display = 'block'
          document.getElementById("register").style.display = 'block'
          document.getElementById("dashboard").style.display = 'none'
      }
  });
    
  function createResturant() {
      // var name = document.getElementById("rname").value;
      // var location = document.getElementById("rlocation").value;
      // var rating = document.getElementById("rrating").value;
  
  
      var fileLink = downloadLink;
  
      var resturant = {
          name: document.getElementById("rname").value,
          location: {
              city:  document.getElementById("rcity").value,
              pincode: document.getElementById("rpincode").value,
          },
          rating: document.getElementById("rrating").value,
          fileLink: fileLink
      }
  
       db.collection("resturants").add(resturant).then(response => {
          console.log('Written to database')
          hideCreateShop();
          alert("Shop has been created")
       }).catch(error => {
          console.log(error.message)
      })
  
  
      // db.collection("resturants").doc('xyz').set(resturant).then(response => {
      //     console.log('Written to database')
      // }).catch(error => {
      //     console.log(error.message)
      // })
  
  }
  
  function getResturant() {
      db.collection("resturants").doc("BX3rqCD6pwoHgp0yHiup").get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  }
  
  function getAllResturants() {
      db.collection("resturants").orderBy("name", "desc").get().then(function (querySnapshot) {
          // var temp = ''
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              // temp += doc.data().name + '</br>';
              // temp += `${doc.data().name} <button onclick="deleteResturant('${doc.id}')">Delete</button> </br>`;
          });
          // document.getElementById("rlist").innerHTML = temp
      });
  }
  
  function deleteResturant(id) {
      db.collection("resturants").doc(id).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
  }
  
  function uploadFile(){
      var storageRef = firebase.storage().ref('images/'+file.name);
      var task = storageRef.put(file);
      task.on('state_changed', function progress(snapshot) {
          var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          uploader.value = percentage;
  
      }, function error(err) {
          
      },function complete() {
          task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              console.log('File available at', downloadURL);
              downloadLink = downloadURL;
          });
      });
  }
  
  
  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('fileButton');
  var file;
  var downloadLink;
  
  fileButton.addEventListener('change', function(e){
          file = e.target.files[0];
  }); 
  
  // firebase.storage().ref('images/'+file.name).put(file)
  
  function showCreateShop(){
      document.getElementById("rname").value = "";
      document.getElementById("rcity").value = "";
      document.getElementById("rpincode").value = "";
      document.getElementById("rrating").value = "";
      uploader.value = 0;
      document.getElementById("createShopForm").classList.add("is-active")
  }
  
  function hideCreateShop(){
      document.getElementById("createShopForm").classList.remove("is-active")
  }
  