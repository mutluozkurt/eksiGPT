import { cropText } from '../../../utils'
import logo from '../../../logo.png'

const TITLE_RULES = ` **Ekşi Sözlük'te başlık açarken dikkat edilecek hususlar:**  
                    1. Başlıklar genellikle ilgili kavramın ismidir. Nasıl açacağını bilmiyorsan ismini kullan.  
                    2. Kısaltmalar, noktalarla ayrılmış olsalar bile bitişik yazılır. Örn: "dwg", "wysiwyg", "3d".  
                    3. Web sitesi başlıkları her zaman web sitesinin adı olmalıdır. Örn: "Google", "IMDb".  
                    4. Özel adı olmayan web siteleri için adres kullanılabilir. Örn: "www.bilgi.edu.tr".  
                    5. Tarihler "21 aralık 1976" formatında yazılmalıdır.  
                    6. Saatler 24 saat formatında olmalıdır. Örn: "18 00", "07 00".  
                    7. Bir nesne, kavram veya kişi hakkında açılan başlıklara gereksiz tür eklemeyin. Örn: "elma meyvesi" yerine "elma".  
                    8. Kişiler için tam isim kullanılmalıdır. Örn: "adolf hitler", "mustafa kemal atatürk".  
                    9. Kitap, film gibi eserler Türkiye'de yaygın bilinen ismiyle açılmalıdır. Örn: "attack on titan", "pal sokağı çocukları".  
                    10. Bir sayıyla ilgili başlığın sonuna gereksiz ekler getirilmemelidir. Örn: "3 sayısı" yerine "3".  
                    11. Hukuki olarak sorun teşkil edecek başlıklar açılmamalıdır.  
                    12. Yazılımlar resmi ismiyle açılmalıdır. Örn: "Windows 95", "Norton Antivirus".  
                    13. Romen rakamları "I II III" gibi yazılmalı, "L" harfi kullanılmamalıdır.  
                    14. Telefon numaraları bitişik yazılmalıdır. Örn: "4440365", "05320000000".  
                    15. Bir fiil veya deyim için başlık açarken mastar hali kullanılmalıdır. Örn: "gitmek", "alttan almak".  
                    16. Çoğul kullanımı yalnızca gerekliyse yapılmalıdır. Örn: "osmanlılar", "denemeler".  
                    17. Mastar hali olmayan özel başlıklar sadece istisnai durumlarda kullanılabilir.  
                    18. Bir başlık 50 karakter sınırını aşmamalıdır.  
                    19. Aramaya inanın, tekrar başlık açmayın.  
                    20. Türkçe başlıklarda gramer hatası yapılmamalıdır.  
                    21. Asya ülkelerindeki ad ve soyad dizilimleri Türkçe formatına uygun çevrilmelidir. Örn: "akira kurosawa".  
                    22. Yabancı kelimelere getirilen ekler apostrof ile ayrılmalıdır. Örn: "entry'ler".  
                    23. The eki, eserin adı içinde geçiyorsa korunmalıdır. Örn: "The Beatles".  
                    24. Uçak modelleri resmi formatta yazılmalıdır. Örn: "F-16", "MIG 29".  
                    25. Ebat, çözünürlük ve çarpım işlemleri birleşik yazılmalıdır. Örn: "1024x768", "2x2".  
                    26. İçkiler tam ismiyle yazılmalıdır. Örn: "Absolut Citron", "Smirnoff Ice".  
                    27. Yazılışında apostrof kullanılan yabancı eser adları IMDb formatına uygun olmalıdır.  
                    28. Rakamlarla yazılan başlıklarda yanlış anlaşılmalara mahal verilmemelidir.  
                    29. Eserler Türkiye’de yaygın bilinen adıyla açılmalıdır.  
                    30. "i, ii, iii" gibi Romen rakamları yanlış yazılmamalıdır.  
                    31. Yazılı eserlerin ve filmlerin adları doğru yazılmalıdır.  
                    32. Türkiye'de bilinmeyen yabancı eserler yaygın bilinen isimleriyle açılmalıdır.  
                    33. Sayılar için özel ekler getirilmemelidir. Örn: "100 numara", "12 monkeys".  `

function createButton({ type = 'button', title, textContent, tabIndex = -1, onClick }) {
  const button = document.createElement('button')
  button.type = type
  button.title = title
  button.textContent = textContent
  button.tabIndex = tabIndex

  const img = document.createElement('img')
  img.src = logo
  img.alt = title
  img.style.width = '12px'
  img.style.height = '12px'
  img.style.objectFit = 'contain'
  img.style.marginLeft = '5px'
  img.style.marginBottom = '-2px'

  button.appendChild(img)
  button.addEventListener('click', onClick)
  return button
}

function createButtonFeedbackContainer({ className, title, text, marginLeft, handleClick }) {
  const button = document.createElement('a')
  button.classList.add(className)
  button.title = title
  button.textContent = text
  button.style.cursor = 'pointer'
  button.style.marginLeft = marginLeft
  button.style.textDecoration = 'none'
  button.style.marginTop = '5px'

  const img = document.createElement('img')
  img.src = logo
  img.alt = title
  img.style.width = '12px'
  img.style.height = '12px'
  img.style.objectFit = 'contain'
  img.style.marginLeft = '5px'
  img.style.marginBottom = '-2px'

  button.appendChild(img)
  button.addEventListener('click', handleClick)

  return button
}

function feedbackContainerButtons(handleButtonClick) {
  const entries = document.querySelectorAll('#entry-item-list > li')

  entries.forEach((entry) => {
    if (entry.querySelector('.summarize-button') || entry.querySelector('.analyze-button')) {
      return
    }

    const feedbackContainer = entry.querySelector('.feedback-container')
    if (feedbackContainer) {
      const contentDiv = entry.querySelector('.content-expanded') || entry.querySelector('.content')
      const title = document.querySelector('#title span[itemprop="name"]')?.textContent

      const summarizeButton = createButtonFeedbackContainer({
        className: 'summarize-button',
        title: 'özet geç',
        text: 'özet geç',
        marginLeft: '5px',
        handleClick: async (e) => {
          if (contentDiv) {
            const entryText = contentDiv.innerText.trim()
            if (!entryText) {
              alert('Özetlenecek metin bulunamadı.')
              return
            }
            const prompt = await cropText(`Aşağıdaki metni kısaca özetle:\n\n"${entryText}"`)
            await handleButtonClick(prompt, e)
          }
        },
      })

      const analyzeButton = createButtonFeedbackContainer({
        className: 'analyze-button',
        title: 'analiz et',
        text: 'analiz et',
        marginLeft: '15px',
        handleClick: async (e) => {
          if (contentDiv) {
            const entryText = contentDiv.innerText.trim()
            if (!entryText) {
              alert('Analiz edilecek metin bulunamadı.')
              return
            }
            const prompt = await cropText(
              `Aşağıdaki metin Ekşi Sözlük'te ${title} başlığına ait bir entry, bu entry'i 3 madde halinde analiz et:\n\n"${entryText}"`,
            )
            await handleButtonClick(prompt, e)
          }
        },
      })

      feedbackContainer.appendChild(summarizeButton)
      feedbackContainer.appendChild(analyzeButton)
    }
  })
}

function addEditToolButtons(handleButtonClick) {
  const editTools = document.querySelector('.edittools')
  if (!editTools) return

  const textarea = document.querySelector('#editbox')
  if (!textarea) return

  const editButton = createButton({
    title: 'edit imla',
    textContent: 'edit imla',
    onClick: async (e) => {
      const originalText = textarea.value
      const text = originalText.trim()
      if (!text) {
        alert('Düzenlenecek metin bulunamadı.')
        return
      }
      const prompt = await cropText(
        `Lütfen aşağıdaki metnin yazım ve imla hatalarını düzelt (tüm harfler küçük olmalı, büyük harf önerisi yapma.):\n\n"${text}"`,
      )

      await handleButtonClick(prompt, e)
    },
  })
  editTools.appendChild(editButton)

  if (document.body.innerText.includes("ekşi sözlük'te böyle bir başlık yok.")) {
    const suggestTitleButton = createButton({
      title: 'başlık öner',
      textContent: 'başlık öner',
      onClick: async (e) => {
        const text = textarea.value.trim()
        const newTitle = document.querySelector('#title').textContent.trim()
        if (!text) {
          alert('Başlık önerisi için metin bulunamadı.')
          return
        }

        const prompt = await cropText(
          `Öncelikle, kullanıcının belirlediği başlığın yazım ve imla hatalarını kontrol et. 
                    (Tüm harfler küçük olmalı, büyük harf önerisi yapma.)  
                
                    Eğer başlıkta herhangi bir imla hatası yoksa, "Başlıkta herhangi bir imla ve yazım hatası yoktur." diye belirt.  
                    Eğer hata varsa, düzeltilmiş halini ver.  
                
                    Daha sonra, aşağıdaki metne uygun olarak, Ekşi Sözlük'ün "başlık açarken dikkat edilecek hususlar" kurallarına uygun şekilde,  
                    3 başlık öner.  
                                
                    ${TITLE_RULES}
                
                    Kullanıcının belirlediği başlık: "${newTitle}"  
                    Kullanıcının başlık için girdiği metin: "${text}"`,
        )

        await handleButtonClick(prompt, e)
      },
    })
    editTools.appendChild(suggestTitleButton)

    // const titleSpellCheckButton = createButton({
    //     title: 'başlık imla',
    //     textContent: 'başlık imla',
    //     onClick: async (e) => {
    //         const title = document.querySelector("#title").textContent.trim();
    //         if (!title) {
    //             alert('Başlık bulunamadı.')
    //             return
    //         }

    //         const prompt = await cropText(
    //             `Lütfen aşağıdaki metnin yazım ve imla hatalarını düzelt. (Tüm harfler küçük olmalı, büyük harf önerisi yapma.):\n\n` +
    //             `Metin: '${title}'\n\n` +
    //             `Eğer metinde herhangi bir imla hatası yoksa, "Başlıkta herhangi bir imla ve yazım hatası yoktur." diye cevap ver.`
    //         );

    //         await handleButtonClick(prompt, e);
    //     },
    // });
    // editTools.appendChild(titleSpellCheckButton);

    const observer = new MutationObserver((mutationsList, observer) => {
      const iconAndTextElement = document.querySelector('.icon-and-text')
      if (iconAndTextElement) {
        iconAndTextElement.click()
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  if (!document.body.innerText.includes("ekşi sözlük'te böyle bir başlık yok.")) {
    const suggestEntryButton = createButton({
      title: 'fikir ver',
      textContent: 'fikir ver',
      onClick: async (e) => {
        const title = document.querySelector('#title span[itemprop="name"]')?.textContent
        let answers = ''
        document.querySelectorAll('ul#entry-item-list li[data-id]').forEach((entry) => {
          const content = entry.querySelector('.content')?.innerHTML.trim()
          const author = entry.querySelector('.entry-author')?.textContent.trim()
          if (content && author) {
            answers += `Yazan: ${author}\nCevap: ${content}\n\n`
          }
        })

        const prompt = await cropText(
          `Aşağıdaki bilgilere dayanarak "${title}" başlığı için bir entry önerisi yaz. Entry, sadece başlıkla uyumlu ve verilen cevapları (aşağıda) temel alan, özgün ve akıcı bir metin olmalıdır.\n\n` +
            `Cevaplar:\n${answers}\n` +
            `Entry önerisini sadece entry olarak yaz. Açıklama, ek bilgi veya başka bir format kullanma. Sadece entryyi yaz.`,
        )

        await handleButtonClick(prompt, e)
      },
    })
    editTools.appendChild(suggestEntryButton)
  }
}

export default {
  init: async (hostname, userConfig, getInput, mountComponent, handleButtonClick) => {
    try {
      if (hostname.includes('eksisozluk.com')) {
        feedbackContainerButtons(handleButtonClick)
        addEditToolButtons(handleButtonClick)

        const targetNode = document.getElementById('entry-item-list')
        if (targetNode) {
          const config = { childList: true }
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                feedbackContainerButtons(handleButtonClick)
              }
            }
          })
          observer.observe(targetNode, config)
        }
      }
    } catch (e) {
      console.log(e)
    }
    return true
  },
  inputQuery: async () => {
    try {
      if (document.body.innerText.includes("ekşi sözlük'te böyle bir başlık yok.")) {
        const newTitle = document.querySelector('#title')?.textContent
        //const content = document.querySelector('#editbox')?.value

        return await cropText(
          `Öncelikle, kullanıcının belirlediği başlığın yazım ve imla hatalarını kontrol et. 
                    (Tüm harfler küçük olmalı, büyük harf önerisi yapma.)  
                
                    Eğer başlıkta herhangi bir imla hatası yoksa, "Başlıkta herhangi bir imla ve yazım hatası yoktur." diye belirt.  
                    Eğer hata varsa, düzeltilmiş halini ver.  
                
                    Daha sonra, kullanıcının belirlediği başlığı dikkate alarak, Ekşi Sözlük'ün "başlık açarken dikkat edilecek hususlar" kurallarına uygun şekilde,  
                    3 başlık öner. Ardından şu açıklamayı kalın harflerle ekle:
                    "Başlık ile ilgili bilgi girdikten sonra 'Başlık Öner' butonuna basarak daha tutarlı başlık önerileri alabilirsiniz."
                                
                    ${TITLE_RULES}
                
                    Kullanıcının belirlediği başlık: "${newTitle}"`,
        )
      } else {
        const title = document.querySelector('#title span[itemprop="name"]')?.textContent
        let answers = ''
        document.querySelectorAll('ul#entry-item-list li[data-id]').forEach((entry) => {
          const content = entry.querySelector('.content')?.innerHTML.trim()
          const author = entry.querySelector('.entry-author')?.textContent.trim()
          if (content && author) {
            answers += `Yazan: ${author}\nCevap: ${content}\n\n`
          }
        })

        return await cropText(
          `Below is the content from a social platform,giving the corresponding summary and your opinion on it.` +
            `The title is:'${title}'` +
            `Some answers are as follows:\n${answers}`,
        )
      }
    } catch (e) {
      console.log(e)
    }
  },
}
