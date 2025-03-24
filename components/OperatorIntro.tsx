import { BetweenVerticalEnd } from "lucide-react";
import { GrNodes } from "react-icons/gr";
import CallToActionCard from "./CallToActionCard";

const OperatorIntroCards = () => {
  const cards = [
    // {
    //   icon: <SquareDashedBottomCode />,
    //   title: <span className="text-xl font-bold ">Service Operators</span>,
    //   description: "Run Blueprint instances and earn job revenue.",
    //   link: "../operators/service-operator/service-provider",
    // },
    {
      icon: <BetweenVerticalEnd />,
      title: <span className="text-xl font-bold ">Validators</span>,
      description:
        "Secure the network by participating in Nominated Proof-of-Stake (nPoS).",
      link: "../operators/validator/introduction",
    },
    {
      icon: <GrNodes />,
      title: <span className="text-xl font-bold ">Run a Node</span>,
      description:
        "Get started with Tangle by running a node, a great way to get familiar with operating.",
      link: "../operators/node-basics/quickstart",
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
