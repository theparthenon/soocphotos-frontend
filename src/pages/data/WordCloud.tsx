import { Divider } from "@mantine/core";
import React, { useEffect } from "react";

import { util } from "@/api/endpoints/utils";
import { WordCloud as WordCloudComp } from "@/components/Charts/WordCloud";
import { useAppDispatch } from "@/store/store";

export default function WordCloud() {
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(util.endpoints.fetchWordCloud.initiate());
    }, []);

    return (
      <div style={{ padding: 10 }}>
        <div>
          <WordCloudComp height={320} type="location" />
          <Divider hidden />
          <WordCloudComp height={320} type="captions" />
          <Divider hidden />
          <WordCloudComp height={320} type="people" />
        </div>
      </div>
    );
}