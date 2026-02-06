"""
Streamlit UI for Code Review Agent
Simple web interface for code review
"""

import streamlit as st
import requests
from typing import Optional


# Page config
st.set_page_config(
    page_title="Code Review Agent",
    page_icon="🔍",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        color: #1f77b4;
    }
    .sub-header {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
    }
    .rating-excellent { color: #28a745; font-weight: bold; font-size: 1.5rem; }
    .rating-good { color: #5cb85c; font-weight: bold; font-size: 1.5rem; }
    .rating-average { color: #ffc107; font-weight: bold; font-size: 1.5rem; }
    .rating-needs-improvement { color: #ff8c00; font-weight: bold; font-size: 1.5rem; }
    .rating-poor { color: #dc3545; font-weight: bold; font-size: 1.5rem; }
    </style>
""", unsafe_allow_html=True)


def get_rating_class(rating: str) -> str:
    """Get CSS class for rating"""
    rating_map = {
        'Excellent': 'rating-excellent',
        'Good': 'rating-good',
        'Average': 'rating-average',
        'Needs Improvement': 'rating-needs-improvement',
        'Poor': 'rating-poor'
    }
    return rating_map.get(rating, 'rating-average')


def get_rating_emoji(rating: str) -> str:
    """Get emoji for rating"""
    rating_map = {
        'Excellent': '🌟',
        'Good': '✅',
        'Average': '⚠️',
        'Needs Improvement': '⚠️',
        'Poor': '❌'
    }
    return rating_map.get(rating, '❓')


# Header
st.markdown('<h1 class="main-header">🔍 Code Review Agent</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">AI-Powered Multi-Language Code Reviewer</p>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.header("⚙️ Settings")
    
    language = st.selectbox(
        "Programming Language",
        ["Auto-detect", "Python", "Java", "C++"],
        help="Select language or let AI detect it"
    )
    
    focus = st.selectbox(
        "Review Focus",
        ["Comprehensive", "Security", "Performance", "Style"],
        help="What aspect to focus on"
    )
    
    use_ai = st.checkbox(
        "Use AI Review",
        value=True,
        help="Enable AI-powered analysis (requires API key)"
    )
    
    st.markdown("---")
    st.markdown("### 📊 Supported Languages")
    st.markdown("✅ Python")
    st.markdown("✅ Java")
    st.markdown("✅ C++")
    
    st.markdown("---")
    st.markdown("### 🎯 Features")
    st.markdown("• Static Code Analysis")
    st.markdown("• AI-Powered Review")
    st.markdown("• Security Scanning")
    st.markdown("• Best Practices Check")
    st.markdown("• Performance Analysis")

# Main content
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("📝 Enter Your Code")
    
    # Code input
    code_input = st.text_area(
        "Paste your code here:",
        height=400,
        placeholder="""def example():
    # Your code here
    pass""",
        help="Paste the code you want to review"
    )
    
    # Example codes
    with st.expander("📚 Load Example Code"):
        example_type = st.selectbox(
            "Select Example",
            ["Python - Bad Example", "Python - Good Example", "Java - Bad Example", "C++ - Bad Example"]
        )
        
        examples = {
            "Python - Bad Example": """def calculate(data):
    password = "hardcoded123"
    result = []
    x = 10
    unused_var = 20
    
    for i in data:
        if i > 0:
            result.append(i * 2)
    
    try:
        value = 10 / 0
    except:
        pass
    
    return result""",
            
            "Python - Good Example": """def calculate_doubled_positive_values(data: list[int]) -> list[int]:
    \"\"\"
    Filter positive values and double them.
    
    Args:
        data: List of integers to process
        
    Returns:
        List of doubled positive values
    \"\"\"
    return [value * 2 for value in data if value > 0]""",
            
            "Java - Bad Example": """public class test {
    static String API_KEY = "12345";
    
    public void MyMethod() {
        String name = "John";
        if (name == "John") {
            System.out.println("Hello");
        }
        
        try {
            int result = 10 / 0;
        } catch (Exception e) {
            
        }
    }
}""",
            
            "C++ - Bad Example": """#include <stdio.h>
using namespace std;

int main() {
    int* data = new int[10];
    int* ptr = NULL;
    
    int value = *ptr;
    
    return 0;
}"""
        }
        
        if st.button("Load Example"):
            code_input = examples[example_type]
            st.rerun()
    
    # Review button
    review_button = st.button("🔍 Review Code", type="primary", use_container_width=True)

with col2:
    st.subheader("📊 Review Results")
    
    if review_button:
        if not code_input.strip():
            st.error("❌ Please enter some code to review!")
        else:
            with st.spinner("🤖 Analyzing your code..."):
                try:
                    # Prepare request
                    lang_map = {
                        "Auto-detect": None,
                        "Python": "python",
                        "Java": "java",
                        "C++": "cpp"
                    }
                    
                    focus_map = {
                        "Comprehensive": "comprehensive",
                        "Security": "security",
                        "Performance": "performance",
                        "Style": "style"
                    }
                    
                    # Make API request (assuming API running locally)
                    # For demo, we'll use local import instead
                    from app import reviewer
                    
                    result = reviewer.review(
                        code=code_input,
                        language=lang_map[language],
                        focus=focus_map[focus],
                        use_ai=use_ai
                    )
                    
                    # Display results
                    st.success("✅ Review completed!")
                    
                    # Rating
                    rating = result['rating']
                    emoji = get_rating_emoji(rating)
                    st.markdown(f"### {emoji} Code Quality: {rating}")
                    
                    # Assessment
                    st.info(f"**Assessment:** {result['assessment']}")
                    
                    # Detected Language
                    st.markdown(f"**Detected Language:** `{result['language'].upper()}`")
                    
                    # Code Summary
                    with st.expander("📈 Code Statistics", expanded=True):
                        summary = result['code_summary']
                        col_a, col_b, col_c, col_d = st.columns(4)
                        col_a.metric("Total Lines", summary['total_lines'])
                        col_b.metric("Code Lines", summary['code_lines'])
                        col_c.metric("Functions", summary['functions'])
                        col_d.metric("Classes", summary['classes'])
                    
                    # Issues
                    with st.expander("❌ Issues Found", expanded=True):
                        if result['issues']:
                            for issue in result['issues']:
                                if '[AI]' in issue:
                                    st.markdown(f"🤖 {issue.replace('[AI]', '').strip()}")
                                else:
                                    st.markdown(f"⚠️ {issue}")
                        else:
                            st.success("No issues found! 🎉")
                    
                    # Suggestions
                    with st.expander("💡 Suggestions", expanded=True):
                        if result['suggestions']:
                            for suggestion in result['suggestions']:
                                if '[AI]' in suggestion:
                                    st.markdown(f"🤖 {suggestion.replace('[AI]', '').strip()}")
                                else:
                                    st.markdown(f"💡 {suggestion}")
                        else:
                            st.info("No suggestions - code looks good!")
                    
                    # AI Analysis Details
                    if use_ai and result.get('ai_analysis'):
                        with st.expander("🤖 AI Analysis Details"):
                            ai_result = result['ai_analysis']
                            st.text(ai_result.get('raw_review', 'No detailed AI review available'))
                
                except Exception as e:
                    st.error(f"❌ Error during review: {str(e)}")
                    st.info("Make sure the API server is running: `python app.py`")
    else:
        st.info("👆 Enter your code and click 'Review Code' to start analysis")
        
        # Show placeholder
        st.markdown("""
        ### How it works:
        
        1. **Paste Your Code**: Enter code in any supported language
        2. **Configure Settings**: Choose language and focus area
        3. **Get AI Review**: Receive comprehensive analysis
        4. **Fix Issues**: Follow suggestions to improve code
        
        ### What we check:
        
        - 🐛 **Bugs & Errors**: Logic errors and runtime issues
        - 🔒 **Security**: Vulnerabilities and security risks  
        - ⚡ **Performance**: Optimization opportunities
        - 📚 **Best Practices**: Language conventions
        - 🎨 **Code Style**: Readability and maintainability
        """)

# Footer
st.markdown("---")
st.markdown(
    "<p style='text-align: center; color: #666;'>Built with ❤️ using Streamlit, FastAPI, and OpenAI</p>",
    unsafe_allow_html=True
)
