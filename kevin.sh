node split.js $1
jconsole gen.ijs
header=header.cj
for file in $(ls *.ckevin)
do
    fn=${file%.*}
    cat $header > $fn.java
    echo >> $fn.java
    echo "#define T $fn" >> $fn.java
    cat "$file" >> $fn.java
    cpp $fn.java | ruby -ne "print\$_ if\$_[0]!=?#&&\$_[1]" | python balance.py > temp.txt
    cat temp.txt > $fn.java
    javac $fn.java
    rm temp.txt
done
java ${1%.*}
rm *.ckevin *.java *.class