import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";
import axios from "axios";
import { getDrupalNidFromPathAlias, getEventPagePath } from "../helpers/fetchHelper";
import { findTaxonomy } from "../helpers/taxonomiesHelper";

import { findEventData } from "../helpers/dataHelper";

import PageUsingParagraphs from "./ParagraphsPage";

import { Lang, EventParams, ParagraphData, UrlAliases } from "../types";

type Data = null | {
  paragraphData: ParagraphData;
  width: any;
};

interface EventProps {
  lang: Lang;
}

function Event(props: EventProps) {
  const [data, setData] = useState<Data>(null);
  const [redirect, setRedirect] = useState(false);
  const { urlAlias } = useParams<EventParams>();
  const history = useHistory();
  const location = useLocation();
  const { lang } = props;

  const fetchData = async () => {
    const nid = await getDrupalNidFromPathAlias(urlAlias);
    if (!nid) {
      setRedirect(true);
    }
    const filter = "&filter[drupal_internal__nid]=" + nid;
    const [fiPage, svPage, enPage] = getEventPagePath(filter);

    const [fi, sv, en] = await Promise.all([axios.get(fiPage), axios.get(svPage), axios.get(enPage)]);

    setData({
      paragraphData: {
        en: findEventData("en", en.data),
        fi: findEventData("fi", fi.data),
        sv: findEventData("sv", sv.data),
      },
      width: findTaxonomy(en.data, "field_page_width"),
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const [, langPath] = location.pathname.split("/");
    if (lang !== langPath) {
      const newPath =
        lang === "fi"
          ? `/fi/tapahtuma/${urlAlias}`
          : lang === "sv"
          ? `/sv/evenemang/${urlAlias}`
          : `/en/event/${urlAlias}`;
      history.replace(newPath);
    }
  }, [lang]);

  if (redirect) {
    return <Redirect to={`/${lang}`} />;
  }

  if (!data) {
    return <></>;
  }

  return <PageUsingParagraphs lang={lang} paragraphData={data.paragraphData} width={data.width} />;
}

export default Event;
