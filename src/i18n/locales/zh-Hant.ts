/* ════════════════════════════════════════════════════════════════
   Locale bundle: 繁體中文(臺灣)  —— the site's mother tongue, the default.
   All user-facing copy lives here; to add a language, copy this file and
   translate the values (see ./en.ts).
   ════════════════════════════════════════════════════════════════ */

import type { LocaleBundle } from "../messages";

const bundle: LocaleBundle = {
  code: "zh-Hant",
  name: "中文",
  html: "zh-Hant",
  messages: {
    threshold: {
      title: "潮汐之燈",
      tagline: "靜觀潮汐變動的觀測者,將深海的重量,萃取成一抹平穩的微光。",
      enter: "進入",
      enterAria: "走過隧道,進入",
      skip: "略過動畫,直接進入",
    },
    colophon: {
      note: "這座島，是憑著一個念頭、趁它還亮著時點起的一盞燈——vibe coding 隨手做的東西，只為讓理念先亮起來，不是打磨完成的作品。島上的文字與內容都可能不準確、未經查證；就當它是潮裡漂來的一點微光，別當成可靠的依據。",
      source: "GitHub 原始碼",
      show: "關於這座島",
      close: "關閉",
    },
    motion: {
      toggle: "詳細動畫",
      detailed: "詳細",
      simple: "簡約",
    },
    version: {
      label: "版本",
      commit: "提交",
      notes: "這一版的記事",
    },
    nav: {
      backToStreet: "← 回到街上",
      setOut: "再出發,回到潮裡",
    },
    street: {
      label: "避風港 · 島上的街",
      title: "世外桃源",
      note: "(避風港島上的一條小街。沿街是一間間店面,推門就進。)",
      empty: "空店面 · 敬請期待",
      library: "圖書館 · 來查、來補",
      cafe: "咖啡廳 · 來坐、來想",
      lookout: "觀星臺 · 來望、來定向",
      paperboat: "紙船舖 · 來摺、來放下",
      stillroom: "煉光舖 · 來煉、來歇",
    },
    lookout: {
      ariaLabel: "觀星臺",
      label: "Lookout · 觀星臺的傳說",
      title: "觀星臺",
      hint: "（輕觸,聽下一段)",
      story: [
        "很久以前,這座島還沒有名字,海上的人也還找不到回家的路。",
        "島上有個女孩,夜夜爬上最高的礁岩,替出海未歸的人,留一盞燈。",
        "有人笑她:「海那麼大,一盞燈,誰看得見?」",
        "她不答,只是把燈舉得更高 —— 一夜,又一夜。",
        "後來她老了,走不動了。村人便在高地上,為她築起一座臺。",
        "那是第一座觀星臺;臺上的燈,從此夜夜不熄。",
        "傳說她離開那夜,燈火化作天上一顆星,落在正北。",
        "從此迷路的船,只要認得那顆星,就找得到這座島。",
        "而島上的潮也學會了她:漲起、退去,卻總會再回來。",
        "於是人們說:出海的人不是離開,是去赴一場遠行。",
        "累了倦了,循著臺上的燈、天上的星,潮水自會把你送回來。",
        "—— 所以這臺上的燈,我們也一直、一直,替你亮著。",
      ],
    },
    paperboat: {
      ariaLabel: "紙船舖",
      label: "紙船舖 · 來摺、來放下",
      lore: "據說,摺一艘紙船放進潮裡,潮會替你把心事,帶到看不見的遠方。",
      prompt: "想放下些什麼?寫下它,或挑一個方向。",
      inputPlaceholder: "寫下想放下的事…",
      inputAria: "想放下的事",
      changeDirection: "← 換方向",
      launch: "摺成小船,放進潮裡",
      foldAnother: "再摺一艘",
      fallbackWish: "一件說不出口的事",
      directions: {
        grief: {
          dir: "悲傷",
          items: ["一段回不去的時光", "一個離開的人", "沒說出口的告別"],
        },
        anxiety: {
          dir: "焦慮",
          items: ["明天的不確定", "一場還沒停的風暴", "怕來不及的自己"],
        },
        anger: {
          dir: "憤怒",
          items: ["一件想原諒的事", "一句傷過你的話", "放不下的不甘心"],
        },
        guilt: {
          dir: "愧疚",
          items: ["一件後悔的事", "來不及的對不起", "對自己的苛責"],
        },
        weariness: {
          dir: "疲憊",
          items: ["今天的疲憊", "一個太重的期待", "撐太久的逞強"],
        },
        studies: {
          dir: "學業",
          items: ["一次考砸的成績", "永遠比不完的同儕", "讀不完的進度"],
        },
        work: {
          dir: "職場",
          items: ["做不完的工作", "沒被看見的努力", "一個難相處的同事"],
        },
        relationships: {
          dir: "人際關係",
          items: ["一段漸遠的友誼", "想討好所有人的累", "一場沒和好的爭執"],
        },
      },
      closings: {
        grief: {
          gone: "潮把它輕輕接走了。",
          cheer: "想念可以留著,但腳步,可以往前了。",
        },
        anxiety: {
          gone: "它順著潮,漂遠了。",
          cheer: "明天還沒來;先把今天,好好走完。",
        },
        anger: {
          gone: "讓潮替你帶走它。",
          cheer: "手鬆開了,才空得出力氣往前走。",
        },
        guilt: {
          gone: "過去的,交給海了。",
          cheer: "你已經盡力了;帶著這份明白,繼續走。",
        },
        weariness: {
          gone: "放下了,潮替你扛一段。",
          cheer: "歇夠了再走也不遲——步調你決定。",
        },
        studies: {
          gone: "這一題,先交給海。",
          cheer: "一次成績不是終點;往前,路還很長。",
        },
        work: {
          gone: "讓它隨潮去,不必再扛。",
          cheer: "你的努力算數;帶著它,繼續往前走。",
        },
        relationships: {
          gone: "有些關係,潮會替你輕輕收著。",
          cheer: "先把自己顧好;往前走,會遇到對的人。",
        },
        default: {
          gone: "潮把它帶走了。",
          cheer: "輕一點了——帶著這份輕,往前走吧。",
        },
      },
    },
    cafe: {
      ariaLabel: "咖啡廳",
      label: "Café · 來坐、來想",
      next: "再想一個",
      prompts: [
        {
          question: "你是被生活推著走,還是自己在划?",
          quote: "對不知道要駛向哪個港口的人,任何風都不是順風。",
          author: "塞內卡《致魯基里烏斯書信集》",
        },
        {
          question: "你怕的,是風暴本身,還是怕風暴的那份恐懼?",
          quote:
            "漁夫明知海危險、風暴可怕,卻從不把危險當作留在岸上的理由。給我現實,給我危險本身。",
          author: "梵谷,致弟弟提奧的信(1882)",
        },
        {
          question: "你歇下來,是為了逃開,還是為了能再出海?",
          quote: "我不怕風暴,因為我正在學習如何駕駛我的船。",
          author: "露意莎·梅·奧爾柯特《小婦人》",
        },
        {
          question: "若風暴不會過去,你還願意啟程嗎?",
          quote: "亦余心之所善兮,雖九死其猶未悔。",
          author: "屈原〈離騷〉",
        },
        {
          question: "哪些事你能改變,哪些只能承受 —— 你分得清嗎?",
          quote: "人不被事情困擾,而被他對事情的看法困擾。",
          author: "愛比克泰德《手冊》",
        },
        {
          question: "當一切都改不了,你還能改變什麼?",
          quote: "有些事在我們能力之內,有些不在 —— 分清楚,是自由的起點。",
          author: "愛比克泰德《手冊》",
        },
        {
          question: "你願意當那塊任浪拍打、卻始終佇立的礁岬嗎?",
          quote:
            "要像礁岬那樣 —— 浪不斷拍來,它兀自佇立,周圍翻騰的水也漸漸平息。",
          author: "馬可·奧理略《沉思錄》4.49",
        },
        {
          question: "你受的苦,有多少是真的,有多少是想出來的?",
          quote: "我們在想像裡受的苦,往往多過現實。",
          author: "塞內卡《致魯基里烏斯書信集》",
        },
        {
          question: "是什麼,值得你為它承受任何一種活法?",
          quote: "一個人若知道為何而活,就能承受幾乎任何一種活法。",
          author: "尼采《偶像的黃昏》",
        },
        {
          question: "擋住你的那件事,會不會就是路本身?",
          quote: "阻礙行動的,反而推進了行動。擋路的,成了路。",
          author: "馬可·奧理略《沉思錄》5.20",
        },
        {
          question: "你的平靜,是因為沒有風浪,還是因為學會了與它同在?",
          quote: "安時而處順,哀樂不能入也。",
          author: "莊子《養生主》",
        },
        {
          question: "你心裡的那團混沌,會長出什麼?",
          quote: "你必須心懷混沌,才能誕生一顆跳舞的星。",
          author: "尼采《查拉圖斯特拉如是說》",
        },
        {
          question: "若這一刻會一再重來,你會怎麼過它?",
          quote: "你要如此生活,彷彿你願意一再重複地活這一生。",
          author: "尼采《快樂的科學》",
        },
        {
          question: "你是在等風停,還是在學著航行?",
          quote: "你無法因為站在岸邊凝視海水,就渡過海。",
          author: "泰戈爾《漂鳥集》",
        },
        {
          question: "同一條河踏不進第二次 —— 你想帶走什麼,又放下什麼?",
          quote: "人無法兩次踏進同一條河。",
          author: "赫拉克利特",
        },
        {
          question: "真正的強,是不被擊垮,還是碎了之後仍長出新的東西?",
          quote: "凡殺不死我的,使我更強大。",
          author: "尼采《偶像的黃昏》",
        },
        {
          question: "你以為的軟弱,會不會其實是另一種堅韌?",
          quote: "天下莫柔弱於水,而攻堅強者莫之能勝。",
          author: "老子《道德經》第七十八章",
        },
        {
          question: "走過那片蕭瑟,你想成為怎樣的人?",
          quote: "回首向來蕭瑟處,歸去,也無風雨也無晴。",
          author: "蘇軾〈定風波〉",
        },
        {
          question: "你願意去愛那些還沒有答案的問題嗎?",
          quote: "請對你心中所有未解的事保持耐心,試著去愛這些問題本身。",
          author: "里爾克《給青年詩人的信》",
        },
        {
          question: "你過的人生,經得起你自己省察嗎?",
          quote: "未經省察的人生,不值得活。",
          author: "蘇格拉底(柏拉圖《申辯篇》)",
        },
        {
          question: "你看得清別人,也看得清自己嗎?",
          quote: "知人者智,自知者明。",
          author: "老子《道德經》第三十三章",
        },
        {
          question: "此刻你能守住的最後一點自由,是什麼?",
          quote: "自由,不是滿足慾望,而是去除慾望。",
          author: "愛比克泰德《手冊》",
        },
        {
          question: "河水日夜不停地流 —— 你也在流嗎?",
          quote: "逝者如斯夫,不舍晝夜。",
          author: "孔子《論語·子罕》",
        },
        {
          question: "那些被加在你身上的事,你打算怎麼處置?",
          quote: "凡是過去,皆為序章。",
          author: "莎士比亞《暴風雨》",
        },
        {
          question: "風浪正大時,你敢掛起帆嗎?",
          quote: "長風破浪會有時,直掛雲帆濟滄海。",
          author: "李白〈行路難〉",
        },
        {
          question: "你看得懂的是回頭的路;那向前呢?",
          quote: "人生只能向後理解,卻必須向前活。",
          author: "齊克果《日記》",
        },
        {
          question: "一身煙雨,你還能從容走自己的路嗎?",
          quote: "竹杖芒鞋輕勝馬,誰怕?一蓑煙雨任平生。",
          author: "蘇軾〈定風波〉",
        },
        {
          question: "那座只有你能跨過的橋,你開始走了嗎?",
          quote: "沒有人能為你造一座你必須親自跨過的橋,除了你自己。",
          author: "尼采《作為教育者的叔本華》",
        },
        {
          question: "你有辦法,獨自安靜地坐在一個房間裡嗎?",
          quote: "人類所有的問題,都源於人無法獨自安靜地坐在一個房間裡。",
          author: "帕斯卡《沉思錄》",
        },
        {
          question: "任四面八方的風來,你還站得住嗎?",
          quote: "千磨萬擊還堅勁,任爾東西南北風。",
          author: "鄭板橋〈竹石〉",
        },
        {
          question: "你要先迷路多久,才肯認識自己?",
          quote: "唯有迷路之後,我們才開始認識自己。",
          author: "梭羅《湖濱散記》",
        },
        {
          question: "路還很長 —— 你願意一直求索下去嗎?",
          quote: "路漫漫其修遠兮,吾將上下而求索。",
          author: "屈原〈離騷〉",
        },
        {
          question: "你找到那個值得你活下去的理由了嗎?",
          quote: "人存在的奧祕,不在於活著,而在於找到為何而活。",
          author: "杜斯妥也夫斯基《卡拉馬助夫兄弟們》",
        },
        {
          question: "面對阻擋,你要硬碰,還是像水一樣繞過、穿透?",
          quote: "上善若水。水善利萬物而不爭。",
          author: "老子《道德經》第八章",
        },
        {
          question: "壓力來時,你還守得住那份從容嗎?",
          quote: "縱浪大化中,不喜亦不懼。",
          author: "陶淵明〈形影神〉",
        },
        {
          question: "苦過、累過之後,你想擔起什麼?",
          quote: "天將降大任於斯人也,必先苦其心志,勞其筋骨。",
          author: "孟子《告子下》",
        },
        {
          question: "被擊敗,和被打倒,你分得出來嗎?",
          quote: "不以物喜,不以己悲。",
          author: "范仲淹〈岳陽樓記〉",
        },
        {
          question: "你願意把一切,都給現在嗎?",
          quote: "把握當下,別太信任明天。",
          author: "賀拉斯《頌歌》",
        },
        {
          question: "你身上那道傷,放進了光,還是關上了門?",
          quote: "你的痛苦,是包覆你理解的硬殼自行破裂。",
          author: "紀伯倫《先知》",
        },
        {
          question: "你會不會,在絕望的另一端才真正開始?",
          quote: "我們都身在陰溝裡,但仍有人仰望星空。",
          author: "王爾德《溫夫人的扇子》",
        },
        {
          question: "與其爭論怎樣才算好,你願意先做一個嗎?",
          quote: "別再爭論一個好人該是什麼樣子。做一個就是了。",
          author: "馬可·奧理略《沉思錄》10.16",
        },
        {
          question: "如果腳下沒有路,你敢自己走出一條嗎?",
          quote: "旅人啊,本來沒有路;路,是走出來的。",
          author: "安東尼奧·馬查多",
        },
        {
          question: "你要把人生過成一場冒險,還是什麼都不是?",
          quote: "凡是不斷努力的人,我們終能拯救他。",
          author: "歌德《浮士德》",
        },
        {
          question: "你想繞過它,還是穿過它?",
          quote: "鍥而不舍,金石可鏤。",
          author: "荀子〈勸學〉",
        },
        {
          question: "痛無可避免 —— 但你要不要,連受苦也一起扛上?",
          quote: "把『我受傷了』的念頭拿掉,傷害本身就消失了。",
          author: "馬可·奧理略《沉思錄》",
        },
        {
          question: "站在選擇面前的那陣暈眩,你認得嗎?",
          quote: "焦慮,是自由的暈眩。",
          author: "齊克果《恐懼的概念》",
        },
        {
          question: "有些日子光是活著就很難 —— 那也算勇敢嗎?",
          quote: "有時候,光是活著,就是一種勇敢。",
          author: "塞內卡《致魯基里烏斯書信集》",
        },
        {
          question: "你把失去看成終結,還是看成改變?",
          quote: "失去,不過是改變;而改變,是自然的喜悅。",
          author: "馬可·奧理略《沉思錄》9.35",
        },
        {
          question: "你決定好,要成為什麼了嗎?",
          quote: "先決定你想成為什麼,然後做你該做的。",
          author: "愛比克泰德",
        },
        {
          question: "走到這裡,你還願意去奮鬥、去追尋、絕不屈服嗎?",
          quote: "去奮鬥,去追尋,去發現,絕不屈服。",
          author: "丁尼生〈尤利西斯〉",
        },
      ],
    },
    stillroom: {
      ariaLabel: "煉光舖",
      label: "煉光舖 · 來煉、來歇",
      lore: "把深海的重量,煉成一抹光。坐下,跟著爐火,一起呼吸就好。",
      phases: {
        inhale: { word: "吸", cue: "把深海,緩緩吸進來" },
        hold: { word: "屏", cue: "停在這裡,一下下" },
        exhale: { word: "吐", cue: "煉成微光,慢慢吐出去" },
        rest: { word: "歇", cue: "空一拍,什麼都不必做" },
      },
      keeper: "(守爐的人添了一塊柴,火光溫溫地亮著,等你喘口氣。)",
      safety: "覺得不舒服或頭暈,就停下來,慢慢正常呼吸就好。",
      notice:
        "煉光舖只是個讓心情放鬆的地方,不是專業的醫療場所;身體若有任何不適,請以自己的狀況為準,需要時尋求專業的醫療協助。",
      reset: "回到原本的節奏",
      settle: {
        hint: "跟著爐火呼吸就好。它會慢慢帶你放慢,覺得這樣剛好,就留在這個節奏。",
        stay: "就留在這個節奏",
      },
      paces: {
        open: "換一種節奏",
        label: "挑一個呼吸的節奏",
        names: {
          gentle: "微光",
          coherent: "平潮",
          calm: "沉靜",
          box: "凝光",
          deep: "深潛",
        },
      },
    },
    library: {
      ariaLabel: "圖書館",
      barTitle: "圖書館 · 來查、來補",
      barSetOut: "再出發",
      indexLabel: "目錄",
      intro: "來查、來補。一份現代的閱讀清單 —— 漂泊、避風港、面對現實與無常。",
      shelves: [
        {
          heading: "面對現實 · 韌性",
          entries: [
            {
              title: "Stanford 2005 畢業演說",
              author: "Steve Jobs",
              blurb:
                "connecting the dots、愛與失去、向死而生;求知若飢,虛心若愚。",
              url: "https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish",
            },
            {
              title: "失敗的附加價值(Harvard 2008)",
              author: "J.K. Rowling",
              blurb: "谷底反而是重建人生的堅實地基;與想像力的力量。",
              url: "https://www.jkrowling.com/harvard-commencement-address/",
            },
            {
              title: "Make Good Art(2012)",
              author: "Neil Gaiman",
              blurb: "被拒、犯錯、迷惘時,就去做好的作品。",
              url: "https://jamesclear.com/great-speeches/make-good-art-by-neil-gaiman",
            },
            {
              title: "脆弱的力量(TED)",
              author: "Brené Brown",
              blurb: "直面脆弱,才生得出勇氣、連結與歸屬。",
              url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
            },
            {
              title: "定義你的恐懼,而非目標(TED)",
              author: "Tim Ferriss",
              blurb: "把最壞情況寫下來,恐懼就縮小了。",
              url: "https://www.ted.com/talks/tim_ferriss_why_you_should_define_your_fears_instead_of_your_goals",
            },
            {
              title: "The Subtle Art of Not Giving a F*ck",
              author: "Mark Manson",
              blurb: "力量不在無所不在乎,而在選對在乎什麼。",
              url: "https://markmanson.net/not-giving-a-fuck",
            },
            {
              title: "The Obstacle Is the Way(介紹)",
              author: "Ryan Holiday",
              blurb: "把阻礙翻轉成前進的路 —— 現代版的斯多噶。",
              url: "https://ryanholiday.net/the-obstacle-is-the-way/",
            },
            {
              title: "定型 vs 成長心態",
              author: "Maria Popova(談 Carol Dweck)",
              blurb: "看待失敗的兩種心態,決定你走多遠。",
              url: "https://www.themarginalian.org/2014/01/29/carol-dweck-mindset/",
            },
            {
              title: "內向者的力量(TED)",
              author: "Susan Cain",
              blurb: "安靜的人也有力量;獨處的價值。",
              url: "https://www.ted.com/talks/susan_cain_the_power_of_introverts",
            },
            {
              title: "活出意義來(介紹)",
              author: "Viktor Frankl",
              blurb:
                "在集中營裡尋得意義的心理學經典:有「為何」就能承受任何「如何」。",
              url: "https://en.wikipedia.org/wiki/Man%27s_Search_for_Meaning",
            },
            {
              title: "100 天被拒練習(TED)",
              author: "Jia Jiang",
              blurb: "主動去找拒絕,反而馴服了對拒絕的恐懼。",
              url: "https://www.ted.com/talks/jia_jiang_what_i_learned_from_100_days_of_rejection",
            },
            {
              title: "最壞的時刻如何造就我們(TED)",
              author: "Andrew Solomon",
              blurb: "在苦難裡鍛造出意義,而非被它定義。",
              url: "https://www.ted.com/talks/andrew_solomon_how_the_worst_moments_in_our_lives_make_us_who_we_are",
            },
            {
              title: "成功、失敗與持續創作的動力(TED)",
              author: "Elizabeth Gilbert",
              blurb: "不論在高峰或谷底,都回到你最愛的那件事。",
              url: "https://www.ted.com/talks/elizabeth_gilbert_success_failure_and_the_drive_to_keep_creating",
            },
            {
              title: "練習情緒急救(TED)",
              author: "Guy Winch",
              blurb: "像照顧身體的傷一樣,照顧心理的傷。",
              url: "https://www.ted.com/talks/guy_winch_why_we_all_need_to_practice_emotional_first_aid",
            },
            {
              title: "Keep Your Identity Small 把認同放小",
              author: "Paul Graham",
              blurb: "別把太多自我綁在標籤上,才想得清楚。",
              url: "https://paulgraham.com/identity.html",
            },
            {
              title: "〈差不多先生傳〉",
              author: "胡適",
              blurb: "以反諷批判「差不多就好」的苟且(現代白話散文)。",
              url: "https://zh.wikisource.org/wiki/差不多先生傳",
            },
          ],
        },
        {
          heading: "時間 · 無常 · 向死而生",
          entries: [
            {
              title: "The Tail End",
              author: "Tim Urban(Wait But Why)",
              blurb: "用圖表算出你和摯愛還剩多少相處的時間。",
              url: "https://waitbutwhy.com/2015/12/the-tail-end.html",
            },
            {
              title: "臨終者的五大遺憾",
              author: "Bronnie Ware",
              blurb: "安寧護理師整理出人臨終最常見的後悔。",
              url: "https://bronnieware.com/blog/regrets-of-the-dying/",
            },
            {
              title: "Life is Short 人生苦短",
              author: "Paul Graham",
              blurb: "狠心刪掉不重要的,別讓「忙」偷走生命。",
              url: "https://paulgraham.com/vb.html",
            },
            {
              title: "一個還算圓滿人生的八個祕密",
              author: "Oliver Burkeman",
              blurb: "事情永遠做不完 —— 而這份體悟讓人自由。",
              url: "https://www.theguardian.com/lifeandstyle/2020/sep/04/oliver-burkemans-last-column-the-eight-secrets-to-a-fairly-fulfilled-life",
            },
            {
              title: "The Busy Trap 忙碌的陷阱",
              author: "Tim Kreider",
              blurb: "「我好忙」其實是對空虛的逃避與自我安慰。",
              url: "https://archive.nytimes.com/opinionator.blogs.nytimes.com/2012/06/30/the-busy-trap/",
            },
            {
              title: "Pale Blue Dot 暗淡藍點",
              author: "Carl Sagan",
              blurb: "從太空回望地球這粒微塵,談謙卑與珍惜。",
              url: "https://www.planetary.org/worlds/pale-blue-dot",
            },
            {
              title: "我們怎麼過一天,就是怎麼過一生",
              author: "Annie Dillard(The Writing Life)",
              blurb: "時間就藏在那些看似微小的日常選擇裡。",
              url: "https://www.themarginalian.org/2013/06/07/annie-dillard-the-writing-life-1/",
            },
            {
              title: "Letting Go 放手",
              author: "Atul Gawande(New Yorker)",
              blurb: "當醫療無法治癒,如何好好地走完最後一程。",
              url: "https://www.newyorker.com/magazine/2010/08/02/letting-go-2",
            },
            {
              title: "When Breath Becomes Air 當呼吸化為空氣(介紹)",
              author: "Paul Kalanithi",
              blurb: "神經外科醫師在絕症中,寫下何以值得活。",
              url: "https://en.wikipedia.org/wiki/When_Breath_Becomes_Air",
            },
            {
              title: "什麼造就美好人生?(TED)",
              author: "Robert Waldinger",
              blurb: "史上最長的幸福研究:好的關係,讓人健康又快樂。",
              url: "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness",
            },
            {
              title: "生命終點真正重要的是什麼(TED)",
              author: "BJ Miller",
              blurb: "安寧醫師談如何好好地活到最後一刻。",
              url: "https://www.ted.com/talks/bj_miller_what_really_matters_at_the_end_of_life",
            },
            {
              title: "面對死亡時,什麼讓生命值得活(TED)",
              author: "Lucy Kalanithi",
              blurb: "在失去與重病裡,重新定義「值得」。",
              url: "https://www.ted.com/talks/lucy_kalanithi_what_makes_life_worth_living_in_the_face_of_death",
            },
            {
              title: "我們對死亡說的四個故事(TED)",
              author: "Stephen Cave",
              blurb: "拆解我們用來安撫死亡恐懼的四種敘事。",
              url: "https://www.ted.com/talks/stephen_cave_the_4_stories_we_tell_ourselves_about_death",
            },
            {
              title: "我的快樂人生哲學(TED)",
              author: "Sam Berns",
              blurb: "早衰症少年,談如何在限制裡仍然豁達地活。",
              url: "https://www.ted.com/talks/sam_berns_my_philosophy_for_a_happy_life",
            },
            {
              title: "Your Life in Weeks 你的一生只有這些週",
              author: "Tim Urban(Wait But Why)",
              blurb: "把一輩子畫成一張週曆,看見時間的有限。",
              url: "https://waitbutwhy.com/2014/05/life-weeks.html",
            },
            {
              title: "〈雨巷〉",
              author: "戴望舒",
              blurb: "雨中悠長而惆悵的現代詩,撐傘走過寂寥。",
              url: "https://zh.wikisource.org/wiki/雨巷",
            },
          ],
        },
        {
          heading: "靜 · 專注 · 獨處",
          entries: [
            {
              title: "The Joy of Quiet 安靜的喜悅",
              author: "Pico Iyer(New York Times)",
              blurb: "在資訊洪流裡,刻意留白與靜止的奢侈。",
              url: "https://www.highbrowmagazine.com/joy-quiet",
            },
            {
              title: "The Art of Stillness 靜止的藝術(TED)",
              author: "Pico Iyer",
              blurb: "哪裡都不去,反而抵達。",
              url: "https://www.ted.com/talks/pico_iyer_the_art_of_stillness",
            },
            {
              title: "The Peace of Wild Things 野物的安寧(詩)",
              author: "Wendell Berry",
              blurb: "夜裡為世界憂懼時,走向靜水,在天恩裡歇息、得自由。",
              url: "https://onbeing.org/poetry/the-peace-of-wild-things/",
            },
            {
              title: "I Used to Be a Human Being",
              author: "Andrew Sullivan",
              blurb: "被科技吞噬的注意力,與一場奪回自己的靜默。",
              url: "https://longreads.com/2016/09/22/i-used-to-be-a-human-being/",
            },
            {
              title: "Breathe 呼吸",
              author: "Leo Babauta(Zen Habits)",
              blurb: "當一切太多,先回到一次呼吸。",
              url: "https://zenhabits.net/breathe/",
            },
            {
              title: "In Praise of Idleness 閒散頌(1932)",
              author: "Bertrand Russell",
              blurb: "重新看待工作與閒暇:留白不是浪費。",
              url: "https://www.panarchy.org/russell/idleness.1932.html",
            },
            {
              title: "Deep Work · 數位極簡(文章集)",
              author: "Cal Newport",
              blurb: "在分心的時代,守住專注這項稀缺而珍貴的能力。",
              url: "https://calnewport.com/writing/",
            },
            {
              title: "每天十分鐘的正念(TED)",
              author: "Andy Puddicombe",
              blurb: "什麼都不做地、好好覺察此刻。",
              url: "https://www.ted.com/talks/andy_puddicombe_all_it_takes_is_10_mindful_minutes",
            },
            {
              title: "快樂的習慣(TED)",
              author: "Matthieu Ricard",
              blurb: "快樂是一種可以訓練的能力,不是運氣。",
              url: "https://www.ted.com/talks/matthieu_ricard_the_habits_of_happiness",
            },
            {
              title: "戒掉壞習慣的簡單方法(TED)",
              author: "Judson Brewer",
              blurb: "用好奇的覺察,鬆開焦慮與衝動的迴圈。",
              url: "https://www.ted.com/talks/judson_brewer_a_simple_way_to_break_a_bad_habit",
            },
            {
              title: "想要快樂?學會感恩(TED)",
              author: "David Steindl-Rast",
              blurb: "停下、看、走 —— 把每一刻當作禮物。",
              url: "https://www.ted.com/talks/david_steindl_rast_want_to_be_happy_be_grateful",
            },
            {
              title: "心流:快樂的祕密(TED)",
              author: "Mihaly Csikszentmihalyi",
              blurb: "全神貫注、忘了時間時的那種忘我之樂。",
              url: "https://www.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness",
            },
            {
              title: "選擇的弔詭(TED)",
              author: "Barry Schwartz",
              blurb: "選項太多,反而讓人焦慮而不快樂。",
              url: "https://www.ted.com/talks/barry_schwartz_the_paradox_of_choice",
            },
            {
              title: "The Top Idea in Your Mind 腦中最上層的念頭",
              author: "Paul Graham",
              blurb: "別讓焦慮佔據你想得最多的那個位置。",
              url: "https://paulgraham.com/top.html",
            },
            {
              title: "How to Be Present 如何回到當下",
              author: "Leo Babauta(Zen Habits)",
              blurb: "把注意力一次次溫柔地帶回此刻。",
              url: "https://zenhabits.net/presence/",
            },
            {
              title: "In Praise of Slowness 放慢的力量(TED)",
              author: "Carl Honoré",
              blurb: "對抗「快還要更快」的時代焦慮。",
              url: "https://www.ted.com/talks/carl_honore_in_praise_of_slowness",
            },
          ],
        },
        {
          heading: "意義 · 工作 · 召喚",
          entries: [
            {
              title: "How to Do What You Love 如何做你愛的事",
              author: "Paul Graham",
              blurb: "別為名與利工作;什麼才是你真正想做的。",
              url: "https://paulgraham.com/love.html",
            },
            {
              title: "Maker's Schedule, Manager's Schedule",
              author: "Paul Graham",
              blurb: "兩種時間表 —— 守住創作所需的整段時間。",
              url: "https://paulgraham.com/makersschedule.html",
            },
            {
              title: "Hell Yeah or No",
              author: "Derek Sivers",
              blurb: "不是「太棒了!」就是「不要」。",
              url: "https://sive.rs/hellyeah",
            },
            {
              title: "Why I Write 我為何寫作",
              author: "George Orwell",
              blurb: "寫作的四種動機,與一份對自己的誠實。",
              url: "https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/why-i-write/",
            },
            {
              title: "On Self-Respect 論自重",
              author: "Joan Didion",
              blurb: "自重,是與自己達成的和解。",
              url: "https://www.vogue.com/article/joan-didion-self-respect-essay-1961",
            },
            {
              title: "人生與寫作教我的十二件事(TED)",
              author: "Anne Lamott",
              blurb: "誠實、慈悲與無常的十二個提醒。",
              url: "https://www.ted.com/talks/anne_lamott_12_truths_i_learned_from_life_and_writing",
            },
            {
              title: "Continuous Improvement 微小習慣的複利",
              author: "James Clear",
              blurb: "每天 1% 的改變,長期是巨大的差距。",
              url: "https://jamesclear.com/continuous-improvement",
            },
            {
              title: "Steal Like an Artist 像藝術家一樣偷",
              author: "Austin Kleon",
              blurb: "創作是站在你愛的東西上,重新組合。",
              url: "https://austinkleon.com/steal/",
            },
            {
              title: "68 Bits of Unsolicited Advice",
              author: "Kevin Kelly",
              blurb: "活過一甲子,整理出的人生忠告。",
              url: "https://kk.org/thetechnium/68-bits-of-unsolicited-advice/",
            },
            {
              title: "The Psychology of Money 金錢心理學",
              author: "Morgan Housel",
              blurb: "財富、貪婪、知足與幸福之間的關係。",
              url: "https://collabfund.com/blog/the-psychology-of-money/",
            },
            {
              title: "人生不只是追求快樂(TED)",
              author: "Emily Esfahani Smith",
              blurb: "意義的四根支柱:歸屬、目的、超越、敘事。",
              url: "https://www.ted.com/talks/emily_esfahani_smith_there_s_more_to_life_than_being_happy",
            },
            {
              title: "更好工作的快樂祕密(TED)",
              author: "Shawn Achor",
              blurb: "先快樂,才有好表現;而非反過來。",
              url: "https://www.ted.com/talks/shawn_achor_the_happy_secret_to_better_work",
            },
            {
              title: "你是給予者,還是索取者?(TED)",
              author: "Adam Grant",
              blurb: "慷慨如何長期帶來意義與成就。",
              url: "https://www.ted.com/talks/adam_grant_are_you_a_giver_or_a_taker",
            },
            {
              title: "The Acceleration of Addictiveness 越來越令人上癮的世界",
              author: "Paul Graham",
              blurb: "當一切都被設計得令人上癮,如何自處。",
              url: "https://paulgraham.com/addiction.html",
            },
            {
              title: "The Goldilocks Rule 剛剛好的難度",
              author: "James Clear",
              blurb: "維持動機的祕密:挑戰要不太難、不太易。",
              url: "https://jamesclear.com/goldilocks-rule",
            },
            {
              title: "Getting Rich vs. Staying Rich 致富與守富",
              author: "Morgan Housel",
              blurb: "賺到與守住,是兩種完全不同的能力。",
              url: "https://collabfund.com/blog/getting-rich-vs-staying-rich/",
            },
          ],
        },
        {
          heading: "更多現代聲音 · 現代中文",
          entries: [
            {
              title: "This Is Water 這是水(2005)",
              author: "David Foster Wallace",
              blurb: "學會選擇注意什麼,把日常的乏味活成覺察與善意。",
              url: "https://fs.blog/david-foster-wallace-this-is-water/",
            },
            {
              title: "七年寫作教我的七件事",
              author: "Maria Popova(The Marginalian)",
              blurb: "關於懷疑、慷慨與耐心的生活功課。",
              url: "https://www.themarginalian.org/2013/10/23/7-lessons-from-7-years/",
            },
            {
              title: "Religion for the Nonreligious",
              author: "Tim Urban(Wait But Why)",
              blurb: "不靠宗教,也能一步步成長為更清醒的自己。",
              url: "https://waitbutwhy.com/2014/10/religion-for-the-nonreligious.html",
            },
            {
              title: "你那難以捉摸的創造力(TED)",
              author: "Elizabeth Gilbert",
              blurb: "把天才當成造訪的客人,卸下創作的重擔。",
              url: "https://www.ted.com/talks/elizabeth_gilbert_your_elusive_creative_genius",
            },
            {
              title: "情緒勇氣的力量(TED)",
              author: "Susan David",
              blurb: "不逃避痛苦的情緒,才談得上韌性。",
              url: "https://www.ted.com/talks/susan_david_the_gift_and_power_of_emotional_courage",
            },
            {
              title: "如何與壓力做朋友(TED)",
              author: "Kelly McGonigal",
              blurb: "改變你對壓力的看法,壓力就改變對你的影響。",
              url: "https://www.ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend",
            },
            {
              title: "恆毅力 Grit(TED)",
              author: "Angela Duckworth",
              blurb: "比天賦更關鍵的,是對長期目標的熱情與堅持。",
              url: "https://www.ted.com/talks/angela_lee_duckworth_grit_the_power_of_passion_and_perseverance",
            },
            {
              title: "〈匆匆〉",
              author: "朱自清",
              blurb: "時間在指縫間溜走的現代散文 —— 呼應潮汐與無常。",
              url: "https://zh.wikisource.org/wiki/匆匆",
            },
            {
              title: "〈故鄉〉",
              author: "魯迅",
              blurb: "回不去的故鄉,與「地上本沒有路,走的人多了,也便成了路」。",
              url: "https://zh.wikisource.org/wiki/故鄉",
            },
            {
              title: "〈再別康橋〉",
              author: "徐志摩",
              blurb: "輕輕的告別,如水的離愁。",
              url: "https://zh.wikisource.org/wiki/再別康橋",
            },
            {
              title: "快樂的驚人科學(TED)",
              author: "Dan Gilbert",
              blurb: "我們會「合成」快樂 —— 幸福不只靠際遇。",
              url: "https://www.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness",
            },
            {
              title: "傾聽羞愧(TED)",
              author: "Brené Brown",
              blurb: "羞愧如何運作,以及如何不被它擊垮。",
              url: "https://www.ted.com/talks/brene_brown_listening_to_shame",
            },
            {
              title: "拖延大師的腦內世界(TED)",
              author: "Tim Urban",
              blurb: "用幽默拆解拖延,與那個沒有期限的恐慌。",
              url: "https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator",
            },
            {
              title: "How to Beat Procrastination 如何打敗拖延",
              author: "Tim Urban(Wait But Why)",
              blurb: "把「現在做」一步步變得可能。",
              url: "https://waitbutwhy.com/2013/11/how-to-beat-procrastination.html",
            },
            {
              title: "There's No Speed Limit 沒有速限",
              author: "Derek Sivers",
              blurb: "沒有人規定你只能用「正常速度」前進。",
              url: "https://sive.rs/kimo",
            },
            {
              title: "〈背影〉",
              author: "朱自清",
              blurb: "父親月台上的背影,克制而深的親情(現代散文)。",
              url: "https://zh.wikisource.org/wiki/背影",
            },
          ],
        },
      ],
    },
  },
};

export default bundle;
