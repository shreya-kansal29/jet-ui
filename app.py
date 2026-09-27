import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path
import re


# =========================================================
# STREAMLIT CONFIG
# =========================================================

st.set_page_config(
    page_title="Aircraft Telemetry",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="collapsed"
)


# =========================================================
# HIDE STREAMLIT UI
# =========================================================

st.markdown(
    """
    <style>

    #MainMenu {
        visibility: hidden;
    }

    header {
        visibility: hidden;
    }

    footer {
        visibility: hidden;
    }

    .stApp {
        background: #020812;
    }

    .block-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
    }

    iframe {
        border: none !important;
        display: block !important;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# =========================================================
# PROJECT PATH
# =========================================================

BASE_DIR = Path(__file__).parent


html_path = BASE_DIR / "index.html"
css_path = BASE_DIR / "style.css"
js_path = BASE_DIR / "app.js"


# =========================================================
# READ FILES
# =========================================================

html = html_path.read_text(
    encoding="utf-8"
)

css = css_path.read_text(
    encoding="utf-8"
)

js = js_path.read_text(
    encoding="utf-8"
)


# =========================================================
# EXTRACT BODY
# =========================================================

body_match = re.search(
    r"<body[^>]*>(.*?)</body>",
    html,
    flags=re.IGNORECASE | re.DOTALL
)


if body_match:

    body = body_match.group(1)

else:

    body = html


# =========================================================
# REMOVE ORIGINAL JS REFERENCES
# =========================================================

body = re.sub(
    r'<script[^>]+src=["\'].*?["\'][^>]*>\s*</script>',
    "",
    body,
    flags=re.IGNORECASE | re.DOTALL
)


# =========================================================
# COMPLETE THREE.JS PAGE
# =========================================================

page = f"""
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>


<!-- =====================================================
     ORIGINAL CSS
===================================================== -->

<style>

{css}

html,
body {{

    margin: 0;

    padding: 0;

    width: 100%;

    height: 100%;

    overflow: hidden;

    background: #020812;

}}

</style>


<!-- =====================================================
     THREE.JS IMPORT MAP
===================================================== -->

<script type="importmap">

{{
    "imports": {{

        "three":
        "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js",

        "three/addons/":
        "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/"

    }}
}}

</script>


</head>


<body>


<!-- =====================================================
     DASHBOARD HTML
===================================================== -->

{body}


<!-- =====================================================
     THREE.JS APPLICATION
===================================================== -->

<script type="module">

{js}

</script>


</body>

</html>
"""


# =========================================================
# RENDER
# =========================================================

components.html(
    page,
    height=900,
    scrolling=False
)