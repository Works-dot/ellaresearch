// ENGLISH TEXTS — ellaresearch.com
//
// The key structure must match the other languages exactly — the builder stops with an error if not.
// A text starting with "§" is a placeholder: the builder strips the mark, shows it visibly on the page
// and counts it. See szovegek/hu.mjs for the full rules (that file is the reference).

export default {
  kod: "en",
  cimke: "English",
  iranyitoCimke: "In English",

  keret: {
    markaNev: "Ella",
    menu: { bemutatkozas: "About Ella", panel: "Join the panel" },
    nyelvvalto: "Magyar",
    nyelvvaltoCim: "Váltás magyarra",
    ugras: "Skip to content",
    lablec: {
      sor: "Ella — research tooling by Works",
      linkek: [
        { cimke: "§Privacy notice", ut: "" },
        { cimke: "§Imprint", ut: "" },
      ],
      jegyzet: "§The legal footer goes here once the texts are ready.",
    },
  },

  bemutatkozas: {
    fejcim: "Ella — research tooling",
    leiras: "§A one-sentence description for search engines and link previews goes here.",
    hero: {
      felcim: "Ella",
      cim: "§Ella's one-sentence promise goes here",
      szoveg: "§Two or three sentences about what Ella is, who it is for, and what makes it different. The copy and the images come later.",
      gomb: "§Primary button",
    },
    kepessegek: {
      cim: "§What Ella does",
      jegyzet: "§The sections have their place; the content is still missing.",
      elemek: [
        { cim: "§First capability", szoveg: "§Two sentences about the first capability." },
        { cim: "§Second capability", szoveg: "§Two sentences about the second capability." },
        { cim: "§Third capability", szoveg: "§Two sentences about the third capability." },
        { cim: "§Fourth capability", szoveg: "§Two sentences about the fourth capability." },
      ],
    },
    menet: {
      cim: "§How it works",
      lepesek: [
        { cim: "§First step", szoveg: "§The first step goes here." },
        { cim: "§Second step", szoveg: "§The second step goes here." },
        { cim: "§Third step", szoveg: "§The third step goes here." },
      ],
    },
    kinek: {
      cim: "§Who it is for",
      szoveg: "§A short intro about who Ella was built for.",
      elemek: ["§First audience", "§Second audience", "§Third audience"],
    },
    atjaro: {
      felcim: "Would you like to take part in research?",
      cim: "Join the Works research panel",
      szoveg: "If you are here as a participant rather than a researcher: anyone can apply to the panel, and you decide which studies you take part in.",
      gomb: "Join the panel",
    },
  },

  panel: {
    fejcim: "Join the Works research panel",
    leiras: "Apply to the Works research panel: take part in studies, and decide for yourself which ones.",
    hero: {
      felcim: "Research panel",
      cim: "Say what you think, and shape the product other people will use",
      szoveg: "The Works research panel is looking for people who are happy to try out a website, an app or a service and say what they make of it. Applying is free, and you can leave at any time.",
      gomb: "Apply to the panel",
    },
    miert: {
      cim: "Why it is worth it",
      elemek: [
        { cim: "You decide what you take part in", szoveg: "Every study comes as its own invitation, with the details: what you will be doing, how long it takes and where it happens. You can turn any of them down, with no consequences." },
        { cim: "What you say counts", szoveg: "Your feedback is about real products still in development, and it reaches the people who make the decisions." },
        { cim: "You do not need to be an expert", szoveg: "Most studies require no background at all: an ordinary user's eye is exactly what is needed." },
        { cim: "§Compensation", szoveg: "§What compensation to expect and what it depends on goes here. Works will provide this copy." },
      ],
    },
    menet: {
      cim: "How it works",
      lepesek: [
        { cim: "You apply", szoveg: "You give us your e-mail address. There is no password to invent: for every sign-in we e-mail you a single-use link." },
        { cim: "You fill in your profile", szoveg: "A few questions about you, so we can offer studies that fit. Anything you would rather not share, you can skip." },
        { cim: "You get an invitation", szoveg: "If you match a study's target group, we invite you by e-mail. If you accept, you pick a time that suits you." },
      ],
    },
    szamits: {
      cim: "What to expect",
      elemek: [
        "Not every invitation leads to taking part: a study has a limited number of places, and the target group decides.",
        "Most studies happen online, over a video call or in your browser, from home.",
        "Taking part is always voluntary: you can stop a study you have already started.",
        "In your account you can see at any time what you have consented to, withdraw it, request your data, or leave the panel.",
      ],
    },
    nem: {
      cim: "What we do not promise",
      szoveg: "Better to be clear now than later:",
      elemek: [
        "This is not a job and not employment: there is no regular work and no shift.",
        "We cannot promise you will get invitations: that depends on which studies start and who they are looking for.",
        "We do not give advice and we do not find work for you.",
      ],
    },
    gyik: {
      cim: "Frequently asked questions",
      elemek: [
        { kerdes: "Does it cost anything?", valasz: "No. Applying and taking part are both free." },
        { kerdes: "Why do I not get a password?", valasz: "Because you do not need one: for every sign-in we e-mail a single-use link to your address. That way there is no password to forget, and none to leak." },
        { kerdes: "What happens to my data?", valasz: "Your data is handled by the owner of the panel. The full notice and the terms of participation are on the application page — before you apply." },
        { kerdes: "Can I leave?", valasz: "Yes, at any time, from your account, without giving a reason. Leaving deletes your profile." },
        { kerdes: "How much time does it take?", valasz: "It varies by study, and the invitation always says how much time to expect. If it does not fit your calendar, you do not have to accept." },
      ],
    },
    zaras: {
      cim: "Apply to the panel",
      szoveg: "An e-mail address is all it takes. On the next step you can also read the Works notice and the terms of participation.",
      gomb: "Apply to the panel",
      jegyzet: "The application continues on the Works panel's own site.",
    },
  },
};
