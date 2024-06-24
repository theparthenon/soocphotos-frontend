import React from "react";

import type { DateTimeRule } from "@/@types/date-time";

function t(key: Array<string | number>) {
    const rules = new Map([
      ["1", "Local time from DATE_TIME_ORIGINAL Exif tag"],
      ["2", "Get Video creation tag in UTC + figure out timezone using GPS coordinates"],
      ["3", "Using filename assuming time is local"],
      ["4", "Video UTC - report local time in UTC (can't find out actual timezone)"],
      ["5", "Extract date using WhatsApp file name"],
      ["6", "Video creation datetime in UTC timezone (can't find out actual timezone)"],
      ["7", "File modified time in user default timezone"],
      ["8", "File modified time in UTC timezone"],
      ["9", "File created time in user default timezone"],
      ["10", "File created time in UTC timezone"],
      ["11", "Use Composite:GPSDateTime tag + figure out timezone using GPS coordinates"],
      ["12", "Use Composite:GPSDateTime tag in user default timezone (can't find out actual timezone)"],
      ["13", "Use Composite:GPSDateTime tag in UTC timezone (can't find out actual timezone)"],
      ["14", "Timestamp set by user"],
      ["15", "Local time from EXIF:DateTime Exif tag"],
      ["rule_type", "Rule type: {{rule}}"],
      ["exif_tag", "Use Exif tag: {{rule}}"],
      ["file_property", "Use file property: {{rule}}"],
      ["source_tz", "Transform from {{rule}}"],
      ["report_tz", "Transform to {{rule}}"],
      ["predefined_regexp", "Use predefined regular expression: {{rule}}"],
    ]);

    return rules.get(key);
}

export function getRuleExtraInfo(rule: DateTimeRule) {
    const ignoredProps = ["name", "id", "rule_type", "transform_tz", "is_default"];
    return (
      <>
        {Object.entries(rule)
          .filter(i => !ignoredProps.includes(i[0]))
          .map(prop => (
            <div key={prop[0]}>
              {t(`rules.${prop[0]}`, { rule: prop[1] }) !== `rules.${prop[0]}` ? (
                <>{t(`rules.${prop[0]}`, { rule: prop[1] })}</>
              ) : (
                <>
                  {prop[0]}: {prop[1]}
                </>
              )}
            </div>
          ))}
      </>
    );
}

