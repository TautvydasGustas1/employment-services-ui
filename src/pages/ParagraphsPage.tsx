import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FooterBottom from "../FooterBottom";
import Paragraphs from "../Paragraphs";
import { Hero, HeroShallow } from "../components/Hero";
import { getAppName } from "../config";
import { Lang, ParagraphData } from "../types";

const useStyles = makeStyles((theme) => ({
  navi: {
    zIndex: 10000,
    fontFamily: "HelsinkiGrotesk",
    fontSize: 16,
  },
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  hero: (heroShallow: Boolean) => ({
    height: heroShallow ? 360 : 550,
  }),
  main: {},
  paragraphs: {
    marginTop: 56,
  },
}));

interface PageUsingParagraphsProps {
  lang: Lang;
  cookieConsent: string;
  nodeData?: any;
  paragraphData: ParagraphData;
  width: any;
}

export default function ParagraphsPage(props: PageUsingParagraphsProps) {
  const { lang, cookieConsent, nodeData, paragraphData, width } = props;
  const useData = lang === 'fi' ? paragraphData.fi : lang === 'sv' ? paragraphData.sv : paragraphData.en;

  let heroTitle = "";
  let heroText = "";
  let heroUrl = "";
  let isHero = true;
  let heroShallow = false;

  if (useData.length > 0 && useData[0].type === "Hero") {
    heroTitle = useData[0].title;
    heroText = useData[0].text;
    heroUrl = useData[0].imageUrl;
    heroShallow = useData[0].shallow;
  } else {
    isHero = false;
  }

  const classes = useStyles(heroShallow);

  // -2 because ReactAndShare is not calculated
  const lastParagraph = !useData ? undefined : useData[useData.length - 2];
  const lastParagraphColor = lastParagraph ? lastParagraph.bgColor : "";

  return (
    <>
      <main className={classes.main}>
        {isHero ? (
          <div className={classes.hero}>
            { heroShallow ? (
              <HeroShallow title={heroTitle} imageUrl={heroUrl} />
            ) : (
              <Hero title={heroTitle} text={heroText} imageUrl={heroUrl}/>
            )}
          </div>
        ) : (
          <></>
        )}
        <div className={classes.paragraphs}>
          <Paragraphs paragraphs={useData} lang={lang} cookieConsent={cookieConsent} nodeData={nodeData} width={width} lastParagraphColor={lastParagraphColor} />
        </div>
      </main>
      <FooterBottom title={getAppName(lang)} lang={lang} lastParagraphColor={lastParagraphColor} />
    </>
  );
}
