const Section = require("../models/Section");
const Developer = require("../models/developer");
const Gallery = require("../models/Gallery");
const Contact = require("../models/contact");


// home route
module.exports.getHome = async (req, res) => {
  const hero = await Section.findOne({
    page: "home",
    section: "hero"
  });

  const about = await Section.findOne({
    page:"home",
    section:"about" 
  });

  const studentGallery = await Section.findOne({
    page:"home",
    section:"gallery",
    flag:"student-gallery"
  });

 const collegeSection = await Section.findOne({
  page:"home",
  section:"college"
 });
 
 const collegeStrem = await Section.findOne({
  page:"home",
  section:"college stream"
 });

 const hostelLife = await Section.findOne({
  page:"home",
  section:"hostel life"
 });

 const eventHeading = await Section.findOne({
  page:"home",
  section:"events",
  flag:"event heading"

 });

 const jayantiEvent = await Section.findOne({
  page:"home",
  section:"events",
  flag:"jayanti"
 });


 const sportEvent = await Section.findOne({
  page:"home",
  section:"events",
  flag:"sport"
 });


const constitutionDay =  await Section.findOne({
  page:"home",
  section:"events",
  flag:"constitutionDay"
});

const dhammachakarEvent =  await Section.findOne({
  page:"home",
  section:"events",
  flag:"dhammachakarEvent"
});

const developer = await Developer.findOne({
  own:"developer"
});


const galleryImages = await Section.findOne({
  page:"home",
  section:"gallery",
  flag:"hostel gallery"
});





res.render("client/index.ejs", { 
    hero, 
    about, 
    studentGallery, 
    collegeSection, 
    collegeStrem, 
    hostelLife, 
    eventHeading,
    jayantiEvent,
    sportEvent,
    constitutionDay,
    dhammachakarEvent,
    developer,
    galleryImages,

    title: "Dr. Babasaheb Ambedkar Boys Government Hostel Chembur, Mumbai",

    description: "Dr. Babasaheb Ambedkar Boys Government Hostel Chembur, Mumbai offers hostel accommodation, facilities, mess services, notices, events, gallery and student information."
});


};


// About route
module.exports.getAbout = async(req, res) =>{
  const developer = await Developer.findOne({
  own:"developer"
});

const heroAbout = await Section.findOne({
  page:"about",
  section:"hero"
});

const hostelOverview = await Section.findOne({
  page:"about",
  section:"about"
});

const ourMission = await Section.findOne({
  page:"about",
  section:"our mission"
});

const lifeAtHostel = await Section.findOne({
  page:"about",
  section:"life at hostel"
});

const aboutWebsite = await Section.findOne({
  page:"about",
  section:"about this website"
});

const disclaimer = await Section.findOne({
  page:"about",
  section:"disclaimer"
});





res.render("client/about.ejs",{
  developer,
  heroAbout,
  hostelOverview,
  ourMission,
  lifeAtHostel,
  aboutWebsite,
  disclaimer,
  title:"About Dr. Babasaheb Ambedkar Boys Hostel, Chembur Mumbai",
  description:"Learn about Dr. Babasaheb Ambedkar Boys Government Hostel, Chembur, its history, vision, facilities, student support, and commitment to providing a quality living and learning environment."

})
}

// facilities page

module.exports.getFacility = async(req,res) =>{
  const developer = await Developer.findOne({
  own:"developer"});

  res.render("client/facilities.ejs",{
    developer,
    title:"Hostel Facilities | Dr. Babasaheb Ambedkar Boys Hostel, Chembur",
    description:"Explore the facilities at Dr. Babasaheb Ambedkar Boys Government Hostel, Chembur, including accommodation, study rooms, mess services, Wi-Fi, security, recreation, and student-friendly amenities."

    }
  );
}




// gallery page
module.exports.getGallery = async(req, res) => {

    const developer = await Developer.findOne({own:"developer"});

    const category = req.query.category || "All";

    let gallery;


    if(category === "All"){

        let allImages = [];

        const allGallery = await Gallery.find();


        allGallery.forEach(item=>{

            item.image.forEach(img=>{

                allImages.push({
                    url: img.url,
                    filename: img.filename,
                    type: img.type
                });

            });

        });


        // Random 30 images
        allImages = allImages
            .sort(()=> Math.random() - 0.5)
            .slice(0,30);


        // Keep same EJS structure
        gallery = [
            {
                image: allImages
            }
        ];


    }else{


        // Show complete category images
        gallery = await Gallery.find({
            category: category
        });


    }


    res.render("client/gallery.ejs",{
        developer,
        gallery,
        category,
        title:"Hostel Gallery | Dr. Babasaheb Ambedkar Boys Hostel, Chembur Mumbai",
        description:"Browse the photo gallery of Dr. Babasaheb Ambedkar Boys Government Hostel, Chembur. Explore hostel facilities, student activities, cultural events, sports, celebrations, and campus life through our image collection."
    });

}


// mess menu

module.exports.getMess = async(req,res) =>{
  const developer = await Developer.findOne({
  own:"developer"

  });

  res.render("client/mess.ejs",{
    developer,
    title:"Hostel Mess Menu | Dr. Babasaheb Ambedkar Boys Hostel, Chembur Mumbai",
    description:"View the weekly mess menu of Dr. Babasaheb Ambedkar Boys Government Hostel, Chembur. Check the daily breakfast, lunch, dinner, and Sunday special meals served to hostel students."
  })
}



// admission page

module.exports.getadmission = async(req, res) =>{
  const developer = await Developer.findOne({
    own:"developer"});

    res.render("client/eligible.ejs",{
      developer,
      title:"Government Hostel Admission | Dr. Babasaheb Ambedkar Boys Hostel",
      description:"Get complete admission information for Dr. Babasaheb Ambedkar Boys Government Hostel, Chembur. Learn about eligibility, required documents, application process, important guidelines, and hostel admission details."
    });
    
}

//  contact page

module.exports.getContact = async(req,res) =>{
  const developer = await Developer.findOne({
  own:"developer"});

  res.render("client/contact.ejs",{
    developer,
    title:"Contact Us | Dr. Babasaheb Ambedkar Boys Hostel, Chembur",
    description:"Contact Dr. Babasaheb Ambedkar Boys Government Hostel, Chembur for hostel information, office contact details, address, location, and student assistance. Find directions and official contact information."

  });
}


// save contact  

module.exports.saveContact = async (req, res) => {

  try {

    const { name, email, subject, message } = req.body;


    if (!name || !email || !message) {
      req.flash("error", "Please fill all required fields");
      return res.redirect("/");
    }


    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });


    await newContact.save();


    req.flash("success", "Message sent successfully!");

    res.redirect("/home");


  } catch (err) {

    console.log(err);

    req.flash("error", "Something went wrong!");

    res.redirect("/hostel-contact");

  }

};