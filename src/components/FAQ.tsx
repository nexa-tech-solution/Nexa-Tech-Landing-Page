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
    question: "Is ScanQR free to use?",
    answer:
      "Yes. ScanQR is free. Optional ads help keep the app lightweight and maintained. There are no accounts or paywalls to scan codes.",
    value: "item-1",
  },
  {
    question: "Does ScanQR work offline?",
    answer:
      "Yes. After the first launch, scanning works offline. All detection runs on-device so you can scan without a network connection.",
    value: "item-2",
  },
  {
    question: "What data do you collect?",
    answer:
      "None. We don’t collect personal data or upload images. Scans and history are stored locally on your device and can be cleared anytime.",
    value: "item-3",
  },
  {
    question: "Which permissions are required?",
    answer:
      "Camera for real-time scanning and Photos/Media to scan from images you choose. Internet is used only to load ads (if enabled).",
    value: "item-4",
  },
  {
    question: "Can I scan from a photo in my gallery?",
    answer:
      "Absolutely. Pick an image from your gallery and ScanQR will detect QR codes or barcodes on-device—nothing is uploaded.",
    value: "item-5",
  },
  {
    question: "What code types are supported?",
    answer:
      "Common QR formats plus popular barcodes (EAN-13/8, UPC-A/E, Code 128, Code 39, ITF, PDF417, and more).",
    value: "item-6",
  },
  {
    question: "Is my scan history private?",
    answer:
      "Yes. History is saved only on your device. You can open, copy, share, or delete entries individually or clear all history.",
    value: "item-7",
  },
  {
    question: "Which languages are available?",
    answer:
      "ScanQR supports multiple languages including English, Vietnamese, French, Spanish, Arabic, Korean, Japanese, Chinese, Thai, Indonesian, and others.",
    value: "item-8",
  },
  {
    question: "Why does a link not open or show correctly?",
    answer:
      "Some QR codes contain incomplete or custom data. Try copying the result and opening it in the appropriate app, or rescan with better lighting.",
    value: "item-9",
  },
  {
    question: "Where can I download ScanQR?",
    answer:
      "You can get ScanQR on Google Play. If you’re on desktop, use the store button on this page or scan the QR download code when available.",
    value: "item-10",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
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
