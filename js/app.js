var p_expression;
var p_age;
var p_gender;
var p_score;
var p_name;
var ck_error;

async function init() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');
    await faceapi.nets.ageGenderNet.loadFromUri('./models');
    //await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    //await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    const image = document.querySelector('#face-image');
    const detection = await faceapi
        .detectSingleFace(image)
        //.withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

    if(!detection) {
        ck_error = 1;
        console.log("error");
    }
    else {
    
    console.log('인식 : ' + detection.detection.score);
    console.log('나이 : ' + detection.age);
    console.log('성별 : ' + detection.gender);
    expresss = Object.keys(detection.expressions);
    let max_probab = 0;
    for (let i = 0; i < expresss.length; i++) {
        probab = parseFloat(detection.expressions[expresss[i]]).toFixed(2);
        console.log(expresss[i] + ' : ' + probab);
        if (max_probab < probab) {
            max_probab = probab;
            p_expression = expresss[i];
        }
    }
    console.log('감정 : ' + p_expression);
    a_x = parseFloat(detection.age).toFixed(0);
    p_age = parseFloat(1/600*a_x*a_x + 13/12*a_x -1).toFixed(0);
    console.log('계산나이 : ' + p_age);
    p_gender = detection.gender;
    p_score = parseFloat(detection.detection.score).toFixed(2);

    face_x = detection.detection.box._x;
    face_y = detection.detection.box._y;
    face_width = detection.detection.box._width;
    face_height = detection.detection.box._height;
    const regionsToExtract = [new faceapi.Rect(face_x, face_y, face_width, face_height)];
    const face = await faceapi.extractFaces(image, regionsToExtract);

    if(p_gender == "male") nan = Math.floor(Math.random() * 100);
    else nan = Math.floor(Math.random() * 100 + 100);
    await $.getJSON('https://web-comic-ucbef.run.goorm.io/web_comic/name.json', function (data) {
    //await $.getJSON('https://bestgift.gq/name.json', function (data) {
        p_name = data[nan]['name'];
    });

    var html_face =
        "<div class='friend'><p><strong>" + p_name + " (" +
        p_age +
        '살)</strong><br><span>성별: ' +
        p_gender +
        ', 감정: ' +
        p_expression +
        '</span></p></div><br>';
    $('#loading').after(html_face);
    $('.friend').prepend(face);
    
    /*
    //const container = document.createElement('div')
    //container.style.position = 'relative'
    //$('#face-image').append(container)
    const canvas = faceapi.createCanvasFromMedia(image);
    canvas.style.position = 'relative';
    canvas.style.zIndex = 1000;
    const dimensions = {
        width: image.width,
        height: image.height
    };
    const resizedDimensions = faceapi.resizeResults(detection, dimensions);
    //$('#face-image').attr("src", canvas.toDataURL());
    $('#face-image').append(canvas);
    faceapi.draw.drawDetections(canvas, resizedDimensions);
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDimensions);
    //faceapi.draw.drawFaceExpressions(canvas, resizedDimensions);
    */
    //var result_add = "<script>new PartnersCoupang.G({ id:382883 });</script>";
    //$('.file-upload-content').append(result_add);
        
        
    }
}


async function recommand() {
    if(ck_error){
    var result_message = "AI쵸프가 얼굴분석에 실패했습니다!";
    $('.result-message').html(result_message);
    }
    else {
    var cupang_id;
    if(p_gender == "male"){
        if(p_age >= 0 && p_age <= 5) cupang_id = 383579;
        else if(p_age >= 6 && p_age <= 19) cupang_id = 383475;
        else if(p_age >= 20 && p_age <= 29) cupang_id = 383318;
        else if(p_age >= 30 && p_age <= 39) cupang_id = 383587;
        else cupang_id = 383593;
    }
    else {
        if(p_age >= 0 && p_age <= 5) cupang_id = 383579;
        else if(p_age >= 6 && p_age <= 19) cupang_id = 383459;
        else if(p_age >= 20 && p_age <= 29) cupang_id = 382883;
        else if(p_age >= 30 && p_age <= 39) cupang_id = 383586;
        else cupang_id = 383588;
    }
    //  (*•̀ᴗ•́*)و ̑̑
    var result_message = "▼ AI쵸프가 추천드리는 선물입니다! <i class='fas fa-gift'></i> ▼";
    $('.result-message').html(result_message);
    var result_add = '<script>new PartnersCoupang.G({ id:' + cupang_id + ' });</script>';
    $('.ins-add').append(result_add);
    $('ins').not($('.kakao_ad_area')).insertAfter('.ins-add');
    }
}
