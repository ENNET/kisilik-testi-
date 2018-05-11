// Kişilik testi

// Bu, kullanıcıya yönlendirilen kişilik sorularının her birinin ayrı ağırlığını hesaplayan bir kod dizisidir.
// Bir kişilik özelliği içe dönük kabul edilirse ağırlığa olumsuz etki edecektir.
// Bir kişilik özelliği dışa dönük kabul edilirse pozitif ağırlığı olacaktır.

var prompts = [
{
	prompt: '1) İnsanlarla ilk tanışma evresinde zorluk yaşarım',
	weight: -1,
	class: 'group0'
},
{
	prompt: '2) Bazen derin düşüncelere dalar, çevremdekileri görmezden gelirim',
	weight: -1,
	class: 'group1'
},
{
	prompt: '3) Genelde konuşmaları ben başlatmam',
	weight: -1,
	class: 'group2'
},
{
	prompt: '4) Kızgın veya üzgün görünen insanlarla ilgilenirim',
	weight: 1,
	class: 'group3'
},
{
	prompt: '5) Arkadaşlarımı dikkatli bir şekilde seçerim',
	weight: -1,
	class: 'group4'
},
{
	prompt: '6) Kendimi başkalarına ifade etmekte zorlanmam',
	weight: 1,
	class: 'group5'
},
{
	prompt: '7) Genellikle yüksek motivasyona sahip ve enerjik biriyim',
	weight: 1,
	class: 'group6'
},
{
	prompt: '8) Dinlenme zamanlarında arkadaşlarımla olmak yerine yalnız kalmayı tercih ederim',
	weight: -1,
	class: 'group7'
},
{
	prompt: '9) Düşünme ve araştırmaktan çok hareket isteyen bir işte çalışmayı isterim',
	weight: 1,
	class: 'group8'
},
{
	prompt: '10) Sık sık geçmişi düşünür anılarımı yeniden yaşarım',
	weight: -1,
	class: 'group9'
},
{
	prompt: '11) Kendimi insanlara  kanıtlamak zorunda olduğumu hissetmem',
	weight: 1,
	class: 'group10'
},
{
	prompt: '12) Plan yapmaktan çok doğaçlama yapmayı tercih ederim',
	weight: 1,
	class: 'group11'
}

]

// Bu dizi, olası tüm değerleri ve değerle ilişkili ağırlığı saklar. 

var prompt_values = [
{
	value: 'Kesinlikle katılıyorum', 
	class: 'btn-default btn-kesinlikle-katiliyorum',
	weight: 5
},
{
	value: 'Katılıyorum',
	class: 'btn-default btn-katiliyorum',
	weight: 3,
}, 
{
	value: 'Kısmen katılıyorum', 
	class: 'btn-default btn-kismen_katiliyorum',
	weight: 0
},
{
	value: 'Katılmıyorum',
	class: 'btn-default btn-katilmiyorum',
	weight: -3
},
{ 
	value: 'Kesinlikle katılmıyorum',
	class: 'btn-default btn-kesinlikle-katilmiyorum',
	weight: -5
}
]

//  Her komut için, liste grubuna eklenecek bir liste öğesi oluşturulur.
function createPromptItems() {

	for (var i = 0; i < prompts.length; i++) {
		var prompt_li = document.createElement('li');
		var prompt_p = document.createElement('p');
		var prompt_text = document.createTextNode(prompts[i].prompt);

		prompt_li.setAttribute('class', 'list-group-item prompt');
		prompt_p.appendChild(prompt_text);
		prompt_li.appendChild(prompt_p);

		document.getElementById('quiz').appendChild(prompt_li);
	}
}


function createValueButtons() {
	for (var li_index = 0; li_index < prompts.length; li_index++) {
		var group = document.createElement('div');
		group.className = 'btn-group btn-group-justified';

		for (var i = 0; i < prompt_values.length; i++) {
			var btn_group = document.createElement('div');
			btn_group.className = 'btn-group';

			var button = document.createElement('button');
			var button_text = document.createTextNode(prompt_values[i].value);
			button.className = 'group' + li_index + ' value-btn btn ' + prompt_values[i].class;
			button.appendChild(button_text);

			btn_group.appendChild(button);
			group.appendChild(btn_group);

			document.getElementsByClassName('prompt')[li_index].appendChild(group);
		}
	}
}

createPromptItems();
createValueButtons();

// Seçtikleri değerlerin toplam sayısını korur. Toplam negatif ise, kullanıcı içe dönüktür. Pozitif ise, kullanıcı dışa aktarılır.
// Hesaplama 'weight of the value * the weight of the prompt' çarpımını kullanarak tüm değerleri toplar.
var total = 0;

//Grup numarasına bağlı ağırlığı alır.
function findPromptWeight(prompts, group) {
	var weight = 0;

	for (var i = 0; i < prompts.length; i++) {
		if (prompts[i].class === group) {
			weight = prompts[i].weight;
		}
	}

	return weight;
}

// Değere bağlı ağırlığı alır.
function findValueWeight(values, value) {
	var weight = 0;

	for (var i = 0; i < values.length; i++) {
		if (values[i].value === value) {
			weight = values[i].weight;
		}
	}

	return weight;
}

// Kullanıcı,cevabında  Katılıyorum/Katılmıyorum için bir değeri tıkladığında, kullanıcılara neyi seçtiklerini gösterir.
$('.value-btn').mousedown(function () {
	var classList = $(this).attr('class');
	
	var classArr = classList.split(" ");
	
	var this_group = classArr[0];
	

	// Düğme zaten seçilmişse, tıklatıldığında ve daha önce eklenen değerleri toplam olarak çıkardığınızda seçimi kaldırır.
	// Aksi takdirde, gruptaki seçili tüm düğmeleri kaldırır ve yeni tıklananı seçer
	// Ve seçilmemiş ağırlıklı değeri çıkarır ve yeni seçilen ağırlıklı değeri topluluğa ekler.
	if($(this).hasClass('active')) {
		$(this).removeClass('active');
		total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
	} else {
		
		total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $('.'+this_group+'.active').text()));
		
		$('.'+this_group).removeClass('active');

		$(this).addClass('active');
		total += (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
	}

	console.log(total);
})



$('#submit-btn').click(function () {
	// Gönder'i tıkladıktan sonra, toplamları cevaplardan ekler
	// Her grup için aktif olan değeri bulur.
	$('.results').removeClass('hide');
	$('.results').addClass('show');
	
	if(total < 0) {
		
		document.getElementById('results').innerHTML = '<b>İçe dönüksün!</b><br><br>\
		İnsanlarla takılmak yerine kendi başına bir şeyler yapmayı seviyorsun. Çılgınlar gibi dans edeceğin bir partidense çayını kahveni alıp o çok sevdiğin kitabı okumayı tercih edenlerdensin. Aşırı sesli ve ışıklı ortamlar hiç sana göre değil. Tabii ki içe kapanık olman utanman gerektiği anlamına gelmiyor. Görünen o ki beklenmedik durumlara diğer insanlardan çok daha çabuk uyum sağlıyorsun. Etrafında çok insan olacağına az ve öz arkadaşlarının olması senin için çok önemli. Karşındaki insana güvenmek isterken onların da sana güvenmesini istiyorsun. Bir şey yapmadan önce uzun uzun planlayıp sonra harekete geçiyorsun. Sonuç olarak büyük uğraşlarla inşa ettiğin dünyanda senden mutlusu yok!\
		';
	} else if(total > 0) {
		document.getElementById('results').innerHTML = '<b>Dışa dönüksün!</b><br><br>\
		Bütün enerjin çevrendeki insanlardan geliyor! Sosyal hayatında oldukça heyecanlı, istekli, konuşkan ve eğlencelisin. Arkadaş ortamında ilginin sende olmasını seviyorsun. Yalnız geçirilen anlardan hiç keyif almayan, sürekli birileriyle bir şeyler yapmayı isteyen tipik bir dışa dönüksün. Bu sosyal kişiliğin çalışma hayatında da tabii ki seninle; grup çalışmalarını seviyor ve insanlarla birlikteyken daha yaratıcı olduğunu düşünüyorsun. Yani çok başarılı bir takım lideri olabilirsin. Hayatında bazen yollar ikiye ayrılıyor ve üstünde çok düşünmeden birini seçiveriyorsun. Sonucu ne olursa olsun ‘’Bu benim kararım.’’ diyebilmek hiç de zayıf bir insan olmadığını kanıtlamaya yeter de artar bile. Sonuç olarak bu renkli kişiliğinle hem kendinin hem de etrafındaki insanların neşe kaynağısın!';
	} else {
		document.getElementById('results').innerHTML = '<b>Hem içe dönük hem dışa dönüksün!</b><br><br>\
		İçe dönük müsün yoksa dışa dönük mü bilemedik… Ortalarda bir yerlerdesin işte ikisinden de biraz var, ortaya karışık gibi. Hem keyif aldığın sosyal bir çevren var hem de yalnız yaptığın bazı şeyleri seviyorsun. Yeni insanlarla tanışmak, onlarla vakit geçirmek hoşuna gidiyor. Aynı zamanda kendine de vakit ayırıyorsun. Bir gün kalabalık bir doğum günü partisinde olmak isterken ertesi gün eve kapanıp 10 bölüm dizi izlemek daha cazip gelebiliyor sana. Belli bir ortamda konuşan olmayı da dinleyen olmayı da seviyorsun. İş hayatında da oldukça pozitif bir şey bu. Duruma göre grupla çalışabiliyorken yalnızken de harika işler başarabiliyorsun. Sonuç olarak her türlü ortama uyum sağlayabilen bazen rengarenk bazen negatif tonların insanısın!'
	}


	// Sonuçları gönderdikten sonra sınavı gizler
	$('#quiz').addClass('hide');
	$('#submit-btn').addClass('hide');
	$('#retake-btn').removeClass('hide');
})

//Tekrar çöz düğmesini tıklanırsa yeni bir sınav göstermek için ekranı yeniler
$('#retake-btn').click(function () {
	$('#quiz').removeClass('hide');
	$('#submit-btn').removeClass('hide');
	$('#retake-btn').addClass('hide');

	$('.results').addClass('hide');
	$('.results').removeClass('show');
})