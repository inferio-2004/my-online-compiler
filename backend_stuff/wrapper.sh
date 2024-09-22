runcode(){
    local compiler="$1"
    shift
    local input_file="$1"
    local output_file="a.out"

    $compiler "$input_file" -o "$output_file" 2> compilation_error.txt
    local compile_status=$?

    if [ $compile_status -ne 0 ]; then
        cat compilation_error.txt >&2
        exit 1
    fi

    stdbuf -o0 ./"$output_file"

}

if [[ "$1" == "gcc" || "$1" == "g++" ]]; then
    runcode "$@"
else
    exec "$@"
fi