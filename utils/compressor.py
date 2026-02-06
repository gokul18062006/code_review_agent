"""
Code Compression Module
Handles chunking and summarization of large code files
"""

import tiktoken
from typing import List, Dict


class CodeCompressor:
    """Compresses code context for efficient LLM processing"""
    
    def __init__(self, max_tokens: int = 3000):
        """
        Initialize compressor
        
        Args:
            max_tokens: Maximum tokens per chunk
        """
        self.max_tokens = max_tokens
        try:
            self.encoding = tiktoken.get_encoding("cl100k_base")
        except:
            self.encoding = None
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        if self.encoding:
            return len(self.encoding.encode(text))
        else:
            # Fallback: rough estimate
            return len(text) // 4
    
    def split_into_chunks(self, code: str) -> List[str]:
        """
        Split code into manageable chunks
        
        Args:
            code: Source code string
            
        Returns:
            List of code chunks
        """
        lines = code.split('\n')
        chunks = []
        current_chunk = []
        current_tokens = 0
        
        for line in lines:
            line_tokens = self.count_tokens(line)
            
            if current_tokens + line_tokens > self.max_tokens and current_chunk:
                # Save current chunk and start new one
                chunks.append('\n'.join(current_chunk))
                current_chunk = [line]
                current_tokens = line_tokens
            else:
                current_chunk.append(line)
                current_tokens += line_tokens
        
        # Add remaining chunk
        if current_chunk:
            chunks.append('\n'.join(current_chunk))
        
        return chunks
    
    def compress(self, code: str) -> str:
        """
        Compress code by removing comments and extra whitespace
        
        Args:
            code: Source code string
            
        Returns:
            Compressed code
        """
        lines = code.split('\n')
        compressed_lines = []
        
        for line in lines:
            # Remove leading/trailing whitespace
            stripped = line.strip()
            
            # Skip empty lines
            if not stripped:
                continue
            
            # Skip single-line comments (basic approach)
            if stripped.startswith('#') or stripped.startswith('//'):
                continue
            
            compressed_lines.append(line)
        
        return '\n'.join(compressed_lines)
    
    def create_summary(self, code: str, language: str) -> Dict[str, any]:
        """
        Create a summary of the code
        
        Args:
            code: Source code string
            language: Programming language
            
        Returns:
            Summary dictionary
        """
        lines = code.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        
        # Count functions/methods
        if language == 'python':
            functions = len([line for line in lines if 'def ' in line])
            classes = len([line for line in lines if 'class ' in line])
        elif language == 'java':
            functions = len([line for line in lines if 'void ' in line or 'public ' in line and '(' in line])
            classes = len([line for line in lines if 'class ' in line])
        elif language == 'cpp':
            functions = len([line for line in lines if '(' in line and ')' in line and '{' not in line.split('(')[0]])
            classes = len([line for line in lines if 'class ' in line])
        else:
            functions = 0
            classes = 0
        
        return {
            'total_lines': len(lines),
            'code_lines': len(non_empty_lines),
            'functions': functions,
            'classes': classes,
            'tokens': self.count_tokens(code),
            'needs_chunking': self.count_tokens(code) > self.max_tokens
        }
    
    def smart_compress(self, code: str, language: str) -> str:
        """
        Intelligently compress code based on language and size
        
        Args:
            code: Source code string
            language: Programming language
            
        Returns:
            Compressed code or chunked summary
        """
        summary = self.create_summary(code, language)
        
        if not summary['needs_chunking']:
            return code
        
        # If chunking needed, compress first
        compressed = self.compress(code)
        
        if self.count_tokens(compressed) <= self.max_tokens:
            return compressed
        
        # Still too large, return chunks info
        chunks = self.split_into_chunks(code)
        return f"[Code split into {len(chunks)} chunks for analysis]\n\n{chunks[0][:500]}..."


if __name__ == "__main__":
    # Test the compressor
    sample_code = """
def example_function():
    # This is a comment
    print("Hello")
    
    # Another comment
    x = 10
    return x

class ExampleClass:
    def __init__(self):
        self.value = 0
    
    def method(self):
        pass
"""
    
    compressor = CodeCompressor()
    summary = compressor.create_summary(sample_code, 'python')
    print(f"Code Summary: {summary}")
    
    compressed = compressor.compress(sample_code)
    print(f"\nOriginal length: {len(sample_code)}")
    print(f"Compressed length: {len(compressed)}")
