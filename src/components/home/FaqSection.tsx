
import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: t("faq.questions.q1", "Τι είναι το Solana Trade Automator;"),
      answer: t("faq.questions.a1", "Το Solana Trade Automator είναι μια πλατφόρμα αυτοματοποιημένων συναλλαγών για το blockchain του Solana που επιτρέπει στους χρήστες να δημιουργούν και να διαχειρίζονται bots συναλλαγών, τα οποία ακολουθούν συγκεκριμένες στρατηγικές για την αγορά και την πώληση tokens.")
    },
    {
      question: t("faq.questions.q2", "Πώς λειτουργούν τα trading bots;"),
      answer: t("faq.questions.a2", "Τα trading bots παρακολουθούν συνεχώς την αγορά και εκτελούν αυτόματα συναλλαγές βάσει προκαθορισμένων παραμέτρων και στρατηγικών. Μπορείτε να ρυθμίσετε τα bots για να ακολουθήσουν συγκεκριμένες στρατηγικές όπως DCA, grid trading, ή arbitrage.")
    },
    {
      question: t("faq.questions.q3", "Είναι ασφαλή τα κεφάλαιά μου;"),
      answer: t("faq.questions.a3", "Ναι, η πλατφόρμα μας είναι σχεδιασμένη έτσι ώστε να έχετε πάντα τον πλήρη έλεγχο των κεφαλαίων σας. Τα κλειδιά του πορτοφολιού σας δεν αποθηκεύονται ποτέ στους διακομιστές μας και όλες οι συναλλαγές απαιτούν την έγκρισή σας μέσω του wallet σας.")
    },
    {
      question: t("faq.questions.q4", "Ποιες είναι οι χρεώσεις της πλατφόρμας;"),
      answer: t("faq.questions.a4", "Η πλατφόρμα μας χρεώνει μόνο ένα μικρό ποσοστό (0.1%) για κάθε επιτυχημένη συναλλαγή που πραγματοποιείται από τα bots. Δεν υπάρχουν κρυφές χρεώσεις ή μηνιαίες συνδρομές.")
    },
    {
      question: t("faq.questions.q5", "Πώς μπορώ να ξεκινήσω;"),
      answer: t("faq.questions.a5", "Για να ξεκινήσετε, συνδέστε απλώς το Phantom wallet σας, επιλέξτε τα tokens που θέλετε να χρησιμοποιήσετε, ρυθμίστε τις παραμέτρους του bot και ενεργοποιήστε το. Η πλατφόρμα μας έχει σχεδιαστεί για να είναι εύκολη στη χρήση, ακόμη και για αρχάριους στο χώρο του crypto.")
    }
  ];
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-emerald-500 to-teal-400',
    'from-amber-500 to-orange-400',
    'from-indigo-500 to-blue-400'
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900 z-0"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("faq.title", "Συχνές Ερωτήσεις")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("faq.subtitle", "Απαντήσεις στις πιο συχνές ερωτήσεις για το Solana Trade Automator")}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`mb-6 overflow-hidden bg-gradient-to-r ${gradients[index % gradients.length]} p-0.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full p-6 text-left"
                >
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out px-6 ${
                    openIndex === index ? 'pb-6 max-h-96' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
