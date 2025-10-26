import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Nexa used for?",
    answer:
      "Nexa is an event engagement and activation platform that helps brands run QR-based campaigns, lucky draws, surveys, and on-site registrations with real-time analytics.",
    value: "item-1",
  },
  {
    question: "Can Nexa work offline?",
    answer:
      "Yes. Nexa supports offline-first operation for event check-ins and lucky draws. Data automatically syncs once the connection is restored.",
    value: "item-2",
  },
  {
    question: "Is Nexa customizable for different brands?",
    answer:
      "Absolutely. You can fully customize the theme, logo, prize tiers, and flow to match your brand identity and event needs.",
    value: "item-3",
  },
  {
    question: "Does Nexa store participant data securely?",
    answer:
      "Yes. All participant data is encrypted in transit and at rest. Admins have full control over access and can export or delete data at any time.",
    value: "item-4",
  },
  {
    question: "Can I use Nexa for lucky draws or instant prizes?",
    answer:
      "Yes. Nexa supports multiple prize mechanisms—random draws, tiered rewards, instant win, and spin-the-wheel styles with configurable logic.",
    value: "item-5",
  },
  {
    question: "Which analytics does Nexa provide?",
    answer:
      "Nexa gives you live insights on scans, participants, winners, locations, and conversion rates. You can export detailed reports for each campaign.",
    value: "item-6",
  },
  {
    question: "Can Nexa integrate with our CRM or backend?",
    answer:
      "Yes. Nexa offers REST and webhook integrations so you can connect participant data and prize results directly to your existing systems.",
    value: "item-7",
  },
  {
    question: "Does Nexa support multiple languages?",
    answer:
      "Yes. Nexa supports multilingual campaigns including English, Vietnamese, Korean, Japanese, Chinese, and more for seamless regional events.",
    value: "item-8",
  },
  {
    question: "Do participants need to install an app?",
    answer:
      "No. Nexa runs instantly through mobile browsers via QR scan. You can also embed it as a Zalo Mini App or on your own microsite.",
    value: "item-9",
  },
  {
    question: "How can I try Nexa?",
    answer:
      "You can request a demo to explore the dashboard, campaign builder, and live event tools. Contact us and our team will set it up for you.",
    value: "item-10",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-green-400 to-green-700 text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="mailto:cs.nexatech@gmail.com"
          className="text-green-600 transition-all border-green-600 hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
