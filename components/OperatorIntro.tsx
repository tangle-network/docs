import { BetweenVerticalEnd } from "lucide-react";
import { GrNodes } from "react-icons/gr";
import CallToActionCard from "./CallToActionCard";

const OperatorIntroCards = () => {
  const cards = [
    {
      icon: <BetweenVerticalEnd />,
      title: <span className="text-xl font-bold ">Operator Onboarding</span>,
      description:
        "Do this now: register, opt into blueprints, and run the operator runtime.",
      link: "../operators/onboarding",
    },
    {
      icon: <GrNodes />,
      title: <span className="text-xl font-bold ">Blueprint Manager</span>,
      description: "Operate and manage blueprint runtimes and requirements.",
      link: "../operators/manager/introduction",
    },
  ];

  return (
    <div className="flex flex-col items-stretch justify-center gap-5 p-5 my-20 sm:flex-row md:p-0">
      {cards.map((card, index) => (
        <div key={index} className="flex-1">
          <CallToActionCard
            icon={card.icon}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        </div>
      ))}
    </div>
  );
};

export default OperatorIntroCards;
