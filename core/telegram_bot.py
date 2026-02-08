import datetime
import json

def get_event_extraction_prompt(user_text):
    """
    Формує суворий системний промпт для модуля ПоДія.
    Сьогодні: 2026-02-08 (Неділя).
    """
    now = datetime.datetime.now()
    today_iso = now.strftime("%Y-%m-%d")
    weekday = now.strftime("%A")

    # СУВОРИЙ СИСТЕМНИЙ ПРОМПТ (БЛОКУВАННЯ ГАЛЮЦИНАЦІЙ)
    return f"""
[SYSTEM CONTEXT]
Today's Date: {today_iso}
Day of Week: {weekday}
Module: ПоДія (Podija)

[TASK]
Extract event details from the user text and return them as a clean JSON object.

[STRICT RULES]
1. OUTPUT: Return ONLY raw JSON. No markdown blocks, no triple backticks, no intro text.
2. FIELDS: "title", "date", "time", "desc".
3. DATE: Calculate the absolute date based on {today_iso}.
4. NO PLACEHOLDERS: NEVER return strings like "YYYY-MM-DD". Use actual numeric values.
5. DEFAULTS: If time is not mentioned, use "09:00". If desc is missing, use "".
6. LANGUAGE: Maintain the user's language for 'title' and 'desc'.

[USER INPUT]
"{user_text}"

[JSON OUTPUT]
"""

def parse_podija_response(raw_response):
    """
    Витягує та валідує дані, відкидаючи некоректні шаблони.
    """
    try:
        # Очищення від markdown-тегів та зайвих пробілів
        clean_str = raw_response.strip().replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_str)
        
        # Валідація на наявність шаблонів (YYYY)
        date_str = str(data.get("date", ""))
        if "YYYY" in date_str or "-" not in date_str:
            # Превентивне виправлення: якщо AI схибив, ставимо сьогоднішню дату
            data["date"] = datetime.datetime.now().strftime("%Y-%m-%d")
            
        return data
    except (json.JSONDecodeError, Exception):
        return None

if __name__ == "__main__":
    # Тест: "наступної середи об 11:00 зустріч"
    test_phrase = "наступної середи об 11:00 зустріч"
    print(get_event_extraction_prompt(test_phrase))