
 
 const gallary = {
     cate1 : {
         0 : "1.jpg",
         1 : "2.jpg",
         2 : "3.jpg",
         3 : "4.jpg",
         4 : "5.jpg",
         5 : "6.jpg"
     },
     cate2 : {
         0 : "7.jpg",
         1 : "8.jpg",
         2 : "9.jpg",
         3 : "10.jpg",
         4 : "11.jpg",
         5 : "12.jpg"
     },
     cate3 : {
         0 : "13.jpg",
         1 : "14.jpg",
         2 : "15.jpg",
         3 : "16.jpg",
         4 : "17.jpg",
         5 : "18.jpg"
     }
     }
     
     
     let x = document.querySelectorAll("#img-001")
     
     
     
     
     function change_gall_1(){
         for (let i = 0; i < 6; i++) {
             x[i].src = `../gall-images/${gallary.cate1[i]}`
         }
         console.log("hi")
     }
     function change_gall_2(){
         for (let i = 0; i < 6; i++) {
             x[i].src = `../gall-images/${gallary.cate2[i]}`
         }
         console.log("hi")
     }
     function change_gall_3(){
         for (let i = 0; i < 6; i++) {
             x[i].src = `../gall-images/${gallary.cate3[i]}`
         }
         console.log("hi")
     }
 
 


let y = document.querySelectorAll(".blog")
let tx = -600
let done = 0
if(done < y.length){
    function next_slide(){
        for (let i = 0; i < y.length; i++) {
            y[i].style.transform = `translateX(${tx}px)`
        }
        tx -= 600
        done++
        console.log("scroll 2s ease 0s 1;")
    }  
}
else{
    function next_slide(){
        for (let i = 0; i < y.length; i++) {
            y[i].style.transform = `translateX(${tx}px)`
        }
        tx -= 600
        done++
        console.log("scroll 2s ease 0s 1;")
    }  
}
