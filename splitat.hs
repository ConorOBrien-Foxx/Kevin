import Data.List
import Data.Maybe
main=interact((uncurry((("{\"first\":"++).).(.((",\"second\":"++).(++"}").show.tail)).(++).show)).(splitAt=<<fromJust.elemIndex '\n'))