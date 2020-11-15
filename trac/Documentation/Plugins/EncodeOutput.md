# Plugin: EncodeOutput 

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

This plugin makes Xinha encode the edited HTML in one of several ways immediately prior to submitting it back to your server.  This is useful for avoiding "mod_security" issues where "mod_security" may detect HTML being submitted to your server and cancel the submission (typically with a 403 error).

The encoded text is prefixed with an indicator code so that you can determine which format it was encoded in when it hits your server.

Responsibility for checking that prefix, removing it and **decoding** the encoded response when it hits your server is yours!

A typical decoding would look like this in PHP

```
    /** mod_security can be a pain, so sometimes we submit form fields as 
     *  an encoded form, typically rot13.  To identify this we use the 
     *  prefix ":!r13!:"
     *  other methods are available...
     *  //   r13   - input is rot13 (alphanum only is rotated)      -- prefix :!r13!:
     *  //   b64   - input is base64 encoded                        -- prefix :!b64!:
     *  //   64r   - input is base64 encoded and then that is rot13 -- prefix :!64r!:
     *  //   r64   - inpuy is rot13 and then that is base64         -- prefix :!r64!:
     */
     
    function unwrap_mod_security()
    {
      $to_clean = array(&$_GET, &$_POST, &$_REQUEST, &$_COOKIE);
      while(count($to_clean))
      {
        $junk = array_keys($to_clean);
        $cleanKey = array_pop($junk);
        $cleaning =& $to_clean[$cleanKey];          
        unset($to_clean[$cleanKey]);
        foreach(array_keys($cleaning) as $k)
        {          
          // If the key is encoded, decode it
          if(preg_match('/^:![a-z0-9]{3,3}!:/', $k, $M))
          {
            $j = (string) substr($k, 7);
            switch($M[1])
            {
              case ':!r13!:':
                $j = str_rot13($j);
              break;           
              
              case ':!b64!:':
                $j = base64_decode($j);
              break;          
              
              case ':!r64!:':
                $j = str_rot13(base64_decode($j));
                break;
                
              case ':!64r!:':
                $j = base64_decode(str_rot13($j));
                break;              
            }
            
            $cleaning[$j] =& $cleaning[$k];
            unset($cleaning[$k]);
            $k = $j;
          }
          
          if(is_array($cleaning[$k]))
          {
            $to_clean[] =& $cleaning[$k];
          }
          else
          {
            // If the value is encoded, decode it
            if(preg_match('/^(:![a-z0-9]{3,3}!:)/', $cleaning[$k], $M))
            {
              $cleaning[$k] = (string) substr($cleaning[$k], 7);
              switch($M[1])
              {
                case ':!r13!:':
                  $cleaning[$k] = str_rot13($cleaning[$k]);
                break;
                 
                case ':!b64!:':
                  $cleaning[$k] = base64_decode($cleaning[$k]);
                break;          
                
                case ':!r64!:':
                  $cleaning[$k] = str_rot13(base64_decode($cleaning[$k]));
                  break;
                  
                case ':!64r!:':
                  $cleaning[$k] = base64_decode(str_rot13($cleaning[$k]));
                  break;              
                
                default:
                  echo "Unknown encoded form {$M[1]}";
                  exit;
                  break;
              }
            }
          }
        }
      }
    }
```

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

```
xinha_config.EncodeOutput = 
{
  // One of
  // 
  //   r13   - html is rot13 (alphanum only is rotated)      -- prefix :!r13!:
  //   b64   - html is base64 encoded                        -- prefix :!b64!:
  //   64r   - html is base64 encoded and then that is rot13 -- prefix :!64r!:
  //   r64   - html is rot13 and then that is base64         -- prefix :!r64!:
  //
  //   false - no encoding performed (decoding still will if prefixed)
  
  encoder:   'r13'
  
};
```